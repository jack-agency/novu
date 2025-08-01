import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import {
  AnalyticsService,
  CreateNotificationJobs,
  CreateNotificationJobsCommand,
  CreateOrUpdateSubscriberCommand,
  CreateOrUpdateSubscriberUseCase,
  Instrument,
  InstrumentUsecase,
  PinoLogger,
} from '@novu/application-generic';
import { IntegrationRepository, NotificationTemplateEntity, NotificationTemplateRepository } from '@novu/dal';
import {
  buildWorkflowPreferences,
  ChannelTypeEnum,
  InAppProviderIdEnum,
  ISubscribersDefine,
  ProvidersIdEnum,
  STEP_TYPE_TO_CHANNEL_TYPE,
  ResourceTypeEnum,
} from '@novu/shared';
import { StoreSubscriberJobs, StoreSubscriberJobsCommand } from '../store-subscriber-jobs';
import { SubscriberJobBoundCommand } from './subscriber-job-bound.command';

const LOG_CONTEXT = 'SubscriberJobBoundUseCase';

@Injectable()
export class SubscriberJobBound {
  constructor(
    private storeSubscriberJobs: StoreSubscriberJobs,
    private createNotificationJobs: CreateNotificationJobs,
    private createOrUpdateSubscriberUsecase: CreateOrUpdateSubscriberUseCase,
    private integrationRepository: IntegrationRepository,
    private notificationTemplateRepository: NotificationTemplateRepository,
    private logger: PinoLogger,
    private analyticsService: AnalyticsService
  ) {}

  @InstrumentUsecase()
  async execute(command: SubscriberJobBoundCommand) {
    this.logger.assign({
      transactionId: command.transactionId,
      environmentId: command.environmentId,
      organizationId: command.organizationId,
    });

    const {
      subscriber,
      templateId,
      environmentId,
      organizationId,
      userId,
      actor,
      tenant,
      identifier,
      _subscriberSource,
      requestCategory,
      environmentName,
      topics,
    } = command;

    const template = command.bridge?.workflow
      ? await this.getCodeFirstWorkflow(command)
      : await this.getWorkflow({
          _id: templateId,
          environmentId,
        });

    if (!template) {
      throw new BadRequestException(`Workflow id ${templateId} was not found`);
    }

    const templateProviderIds = await this.getProviderIdsForTemplate(environmentId, template);

    await this.validateSubscriberIdProperty(subscriber);

    /**
     * Due to Mixpanel HotSharding, we don't want to pass userId for production volume
     */
    const segmentUserId = ['test-workflow', 'digest-playground', 'dashboard', 'inbox-onboarding'].includes(
      command.payload.__source
    )
      ? userId
      : '';

    this.analyticsService.mixpanelTrack('Notification event trigger - [Triggers]', segmentUserId, {
      name: template.name,
      type: template?.type || ResourceTypeEnum.REGULAR,
      origin: template?.origin,
      transactionId: command.transactionId,
      _template: template._id,
      _organization: command.organizationId,
      channels: template?.steps.map((step) => step.template?.type),
      source: command.payload.__source || 'api',
      subscriberSource: _subscriberSource || null,
      requestCategory: requestCategory || null,
      environmentName,
      statelessWorkflow: !!command.bridge?.url,
    });
    const subscriberProcessed = await this.createOrUpdateSubscriberUsecase.execute(
      CreateOrUpdateSubscriberCommand.create({
        environmentId,
        organizationId,
        subscriberId: subscriber?.subscriberId,
        email: subscriber?.email,
        firstName: subscriber?.firstName,
        lastName: subscriber?.lastName,
        phone: subscriber?.phone,
        avatar: subscriber?.avatar,
        locale: subscriber?.locale,
        data: subscriber?.data,
        channels: subscriber?.channels,
        activeWorkerName: process.env.ACTIVE_WORKER,
      })
    );

    // If no subscriber makes no sense to try to create notification
    if (!subscriberProcessed) {
      Logger.warn(
        `Subscriber ${JSON.stringify(subscriber.subscriberId)} of organization ${
          command.organizationId
        } in transaction ${command.transactionId} was not processed. No jobs are created.`,
        LOG_CONTEXT
      );

      return;
    }

    const createNotificationJobsCommand: CreateNotificationJobsCommand = {
      environmentId,
      identifier,
      organizationId,
      overrides: command.overrides,
      payload: command.payload,
      subscriber: subscriberProcessed,
      template,
      templateProviderIds,
      to: subscriber,
      transactionId: command.transactionId,
      userId,
      tenant,
      topics,
      bridgeUrl: command.bridge?.url,
      /*
       * Only populate preferences if the command contains a `bridge` property,
       * indicating that the execution is stateless.
       *
       * TODO: refactor the Worker execution to handle both stateless and stateful workflows
       * transparently.
       */
      ...(command.bridge?.workflow && {
        preferences: buildWorkflowPreferences(command.bridge?.workflow?.preferences),
      }),
    };

    if (actor) {
      createNotificationJobsCommand.actor = actor;
    }

    const notificationJobs = await this.createNotificationJobs.execute(
      CreateNotificationJobsCommand.create(createNotificationJobsCommand)
    );

    await this.storeSubscriberJobs.execute(
      StoreSubscriberJobsCommand.create({
        environmentId: command.environmentId,
        jobs: notificationJobs,
        organizationId: command.organizationId,
      })
    );
  }

  private async getCodeFirstWorkflow(command: SubscriberJobBoundCommand): Promise<NotificationTemplateEntity | null> {
    const bridgeWorkflow = command.bridge?.workflow;

    if (!bridgeWorkflow) {
      return null;
    }

    const syncedWorkflowId = (
      await this.notificationTemplateRepository.findByTriggerIdentifier(
        command.environmentId,
        bridgeWorkflow.workflowId
      )
    )?._id;

    /*
     * Cast used to convert data type for further processing.
     * todo Needs review for potential data corruption.
     */
    return {
      ...bridgeWorkflow,
      type: ResourceTypeEnum.BRIDGE,
      _id: syncedWorkflowId,
      steps: bridgeWorkflow.steps.map((step) => {
        const stepControlVariables = command.controls?.steps?.[step.stepId];

        return {
          ...step,
          bridgeUrl: command.bridge?.url,
          controlVariables: stepControlVariables,
          active: true,
          template: {
            type: step.type,
          },
        };
      }),
    } as unknown as NotificationTemplateEntity;
  }

  @Instrument()
  private async getProviderId(environmentId: string, channelType: ChannelTypeEnum): Promise<ProvidersIdEnum> {
    const integration = await this.integrationRepository.findOne(
      {
        _environmentId: environmentId,
        active: true,
        channel: channelType,
      },
      'providerId'
    );

    return integration?.providerId as ProvidersIdEnum;
  }

  @Instrument()
  private async validateSubscriberIdProperty(subscriber: ISubscribersDefine): Promise<boolean> {
    const subscriberIdExists = typeof subscriber === 'string' ? subscriber : subscriber.subscriberId;

    if (!subscriberIdExists) {
      throw new BadRequestException(
        'subscriberId under property to is not configured, please make sure all subscribers contains subscriberId property'
      );
    }

    return true;
  }

  private async getWorkflow({ _id, environmentId }: { _id: string; environmentId: string }) {
    return await this.notificationTemplateRepository.findById(_id, environmentId);
  }

  @InstrumentUsecase()
  private async getProviderIdsForTemplate(
    environmentId: string,
    template: NotificationTemplateEntity
  ): Promise<Record<ChannelTypeEnum, ProvidersIdEnum>> {
    const providers = {} as Record<ChannelTypeEnum, ProvidersIdEnum>;

    // eslint-disable-next-line no-unsafe-optional-chaining
    for (const step of template?.steps) {
      const type = step.template?.type;
      if (!type) continue;

      const channelType = STEP_TYPE_TO_CHANNEL_TYPE.get(type);

      if (!channelType) continue;

      if (providers[channelType] || !channelType) continue;

      if (channelType === ChannelTypeEnum.IN_APP) {
        providers[channelType] = InAppProviderIdEnum.Novu;
      } else {
        const provider = await this.getProviderId(environmentId, channelType);
        if (provider) {
          providers[channelType] = provider;
        }
      }
    }

    return providers;
  }
}
