/* eslint-disable global-require */
// eslint-ignore max-len
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import {
  ChangeRepository,
  ControlValuesRepository,
  LocalizationResourceEnum,
  MessageTemplateRepository,
  NotificationGroupRepository,
  NotificationStepData,
  NotificationStepEntity,
  NotificationTemplateEntity,
  NotificationTemplateRepository,
} from '@novu/dal';
import {
  buildWorkflowPreferences,
  ChangeEntityTypeEnum,
  ControlValuesLevelEnum,
  isBridgeWorkflow,
  PreferencesTypeEnum,
  ResourceOriginEnum,
} from '@novu/shared';

import {
  AnalyticsService,
  ContentService,
  CreateChange,
  CreateChangeCommand,
  CreateMessageTemplate,
  CreateMessageTemplateCommand,
  DeletePreferencesCommand,
  DeletePreferencesUseCase,
  GetPreferences,
  UpsertPreferences,
  UpsertUserWorkflowPreferencesCommand,
  UpsertWorkflowPreferencesCommand,
  NotificationStep,
  NotificationStepVariantCommand,
  DeleteMessageTemplate,
  DeleteMessageTemplateCommand,
  UpdateMessageTemplate,
  UpdateMessageTemplateCommand,
  Instrument,
  InstrumentUsecase,
  ResourceValidatorService,
  isVariantEmpty,
  PlatformException,
  PinoLogger,
} from '@novu/application-generic';
import { UpdateWorkflowCommand } from './update-workflow.command';
import { GetWorkflowWithPreferencesCommand } from '../get-workflow-with-preferences/get-workflow-with-preferences.command';
import { GetWorkflowWithPreferencesUseCase } from '../get-workflow-with-preferences/get-workflow-with-preferences.usecase';
import { WorkflowWithPreferencesResponseDto } from '../../dtos/get-workflow-with-preferences.dto';

/**
 * @deprecated - use `UpsertWorkflow` instead
 */
@Injectable()
export class UpdateWorkflow {
  constructor(
    private notificationTemplateRepository: NotificationTemplateRepository,
    private messageTemplateRepository: MessageTemplateRepository,
    private changeRepository: ChangeRepository,
    private notificationGroupRepository: NotificationGroupRepository,
    private createMessageTemplate: CreateMessageTemplate,
    private updateMessageTemplate: UpdateMessageTemplate,
    private deleteMessageTemplate: DeleteMessageTemplate,
    private createChange: CreateChange,
    private analyticsService: AnalyticsService,
    private logger: PinoLogger,
    protected moduleRef: ModuleRef,
    private upsertPreferences: UpsertPreferences,
    private deletePreferencesUsecase: DeletePreferencesUseCase,
    private getWorkflowWithPreferencesUseCase: GetWorkflowWithPreferencesUseCase,
    private controlValuesRepository: ControlValuesRepository,
    private resourceValidatorService: ResourceValidatorService
  ) {}

  @InstrumentUsecase()
  async execute(command: UpdateWorkflowCommand): Promise<WorkflowWithPreferencesResponseDto> {
    await this.validatePayload(command);

    const existingTemplate = await this.getWorkflowWithPreferencesUseCase.execute(
      GetWorkflowWithPreferencesCommand.create({
        workflowIdOrInternalId: command.id,
        environmentId: command.environmentId,
        organizationId: command.organizationId,
      })
    );
    if (!existingTemplate) throw new NotFoundException(`Notification template with id ${command.id} not found`);

    let updatePayload: Partial<WorkflowWithPreferencesResponseDto> = {};
    if (command.name) {
      updatePayload.name = command.name;
    }

    if (command.active !== undefined) {
      updatePayload.active = command.active;
    }

    if (command.description !== undefined) {
      updatePayload.description = command.description;
    }

    if (command.workflowId) {
      const isExistingIdentifier = await this.notificationTemplateRepository.findByTriggerIdentifier(
        command.environmentId,
        command.workflowId
      );

      if (isExistingIdentifier && isExistingIdentifier._id !== command.id) {
        throw new BadRequestException(`Workflow with identifier ${command.workflowId} already exists`);
      } else {
        updatePayload['triggers.0.identifier'] = command.workflowId;
      }
    }

    if (command.notificationGroupId) {
      const notificationGroup = this.notificationGroupRepository.findOne({
        _id: command.notificationGroupId,
        _environmentId: command.environmentId,
      });

      if (!notificationGroup)
        throw new NotFoundException(
          `Notification group with id ${command.notificationGroupId} not found, under environment ${command.environmentId}`
        );

      updatePayload._notificationGroupId = command.notificationGroupId;
    }

    const parentChangeId: string = await this.changeRepository.getChangeId(
      command.environmentId,
      ChangeEntityTypeEnum.NOTIFICATION_TEMPLATE,
      existingTemplate._id
    );

    let notificationTemplateWithStepTemplate!: WorkflowWithPreferencesResponseDto;
    await this.notificationTemplateRepository.withTransaction(async () => {
      if (command.steps) {
        updatePayload = this.updateTriggers(updatePayload, command.steps);

        updatePayload.steps = await this.updateMessageTemplates(command.steps, command, parentChangeId);

        await this.deleteRemovedSteps(existingTemplate.steps, command, parentChangeId);
      }

      if (command.tags) {
        updatePayload.tags = command.tags;
      }

      if (command.data) {
        updatePayload.data = command.data;
      }

      if (command.rawData) {
        updatePayload.rawData = command.rawData;
      }

      if (command.payloadSchema) {
        updatePayload.payloadSchema = command.payloadSchema;
      }

      if (command.validatePayload !== undefined) {
        updatePayload.validatePayload = command.validatePayload;
      }

      if (command.status) {
        updatePayload.status = command.status;
      }

      if (command.issues) {
        updatePayload.issues = command.issues;
      }

      if (command.isTranslationEnabled !== undefined) {
        await this.toggleV2TranslationsForWorkflow(existingTemplate.triggers[0].identifier, command);
      }

      // defaultPreferences is required, so we always call the upsert
      await this.upsertPreferences.upsertWorkflowPreferences(
        UpsertWorkflowPreferencesCommand.create({
          templateId: command.id,
          preferences: command.defaultPreferences,
          environmentId: command.environmentId,
          organizationId: command.organizationId,
        })
      );

      if (command.userPreferences !== undefined || command.critical !== undefined) {
        /*
         * userPreferences is optional, so we need to check if it's defined before calling the upsert.
         * we also need to check if the legacy `critical` property is defined, because if provided,
         * it's used to set the `userPreferences.all.readOnly` property
         */

        updatePayload.critical = command.critical;

        this.analyticsService.track('Workflow critical status changed', command.userId, {
          _organization: command.organizationId,
          name: updatePayload.name ?? existingTemplate.name,
          description: updatePayload.description ?? existingTemplate.description,
          new_status: command.userPreferences?.all?.readOnly,
          tags: updatePayload.tags ?? existingTemplate.tags,
        });

        /*
         * This builder pattern is only needed for the `critical` property,
         * ensuring it's set in the `userPreferences.all.readOnly` property
         * when supplied.
         *
         * TODO: remove this once we deprecate the `critical` property
         * and use only the `userPreferences` object
         */
        const defaultUserPreferences = command.userPreferences ?? existingTemplate.userPreferences;
        const defaultCritical =
          command.userPreferences?.all?.readOnly ??
          command.critical ??
          existingTemplate.userPreferences?.all?.readOnly ??
          existingTemplate.critical;

        if (command.userPreferences === null) {
          await this.deletePreferencesUsecase.execute(
            DeletePreferencesCommand.create({
              templateId: command.id,
              environmentId: command.environmentId,
              organizationId: command.organizationId,
              userId: command.userId,
              type: PreferencesTypeEnum.USER_WORKFLOW,
            })
          );
        } else {
          const userPreferences = buildWorkflowPreferences(
            {
              all: {
                readOnly: defaultCritical,
              },
            },
            defaultUserPreferences ?? undefined
          );
          await this.upsertPreferences.upsertUserWorkflowPreferences(
            UpsertUserWorkflowPreferencesCommand.create({
              templateId: command.id,
              preferences: userPreferences,
              environmentId: command.environmentId,
              organizationId: command.organizationId,
              userId: command.userId,
            })
          );

          /** @deprecated - use `userPreferences` instead */
          const preferenceSettings = GetPreferences.mapWorkflowPreferencesToChannelPreferences(userPreferences);
          updatePayload.preferenceSettings = preferenceSettings;

          this.analyticsService.track('Update Preference Defaults - [Platform]', command.userId, {
            _organization: command.organizationId,
            critical: userPreferences?.all?.readOnly ?? false,
            ...preferenceSettings,
          });
        }
      }

      if (!Object.keys(updatePayload).length) {
        throw new BadRequestException('No properties found for update');
      }

      await this.notificationTemplateRepository.update(
        {
          _id: command.id,
          _environmentId: command.environmentId,
        },
        {
          $set: updatePayload,
        }
      );

      notificationTemplateWithStepTemplate = await this.getWorkflowWithPreferencesUseCase.execute(
        GetWorkflowWithPreferencesCommand.create({
          environmentId: command.environmentId,
          organizationId: command.organizationId,
          workflowIdOrInternalId: command.id,
        })
      );

      if (!isBridgeWorkflow(command.type)) {
        const notificationTemplate = this.cleanNotificationTemplate(notificationTemplateWithStepTemplate);

        await this.createChange.execute(
          CreateChangeCommand.create({
            organizationId: command.organizationId,
            environmentId: command.environmentId,
            userId: command.userId,
            type: ChangeEntityTypeEnum.NOTIFICATION_TEMPLATE,
            item: notificationTemplate,
            changeId: parentChangeId,
          })
        );
      }
    });

    this.analyticsService.track('Update Notification Template - [Platform]', command.userId, {
      _organization: command.organizationId,
      steps: command.steps?.length,
      channels: command.steps?.map((i) => i.template?.type),
      critical: command.userPreferences?.all?.readOnly,
    });

    try {
      if (
        (process.env.NOVU_ENTERPRISE === 'true' || process.env.CI_EE_TEST === 'true') &&
        notificationTemplateWithStepTemplate.origin === ResourceOriginEnum.NOVU_CLOUD_V1
      ) {
        if (!require('@novu/ee-shared-services')?.TranslationsService) {
          throw new PlatformException('Translation module is not loaded');
        }
        const service = this.moduleRef.get(require('@novu/ee-shared-services')?.TranslationsService, { strict: false });
        const locales = await service.createTranslationAnalytics(notificationTemplateWithStepTemplate);

        this.analyticsService.track('Locale used in workflow - [Translations]', command.userId, {
          _organization: command.organizationId,
          _environment: command.environmentId,
          workflowId: command.id,
          locales,
        });
      }
    } catch (e) {
      this.logger.error(e, `Unexpected error while importing enterprise modules`, 'TranslationsService');
    }

    return notificationTemplateWithStepTemplate;
  }

  private async validatePayload(command: UpdateWorkflowCommand) {
    if (command.steps) {
      await this.resourceValidatorService.validateStepsLimit(
        command.environmentId,
        command.organizationId,
        command.steps
      );
    }

    const variants = command.steps ? command.steps?.flatMap((step) => step.variants || []) : [];

    for (const variant of variants) {
      if (isVariantEmpty(variant)) {
        throw new BadRequestException(`Variant filters are required, variant name ${variant.name} id ${variant._id}`);
      }
    }
  }

  private async toggleV2TranslationsForWorkflow(workflowIdentifier: string, command: UpdateWorkflowCommand) {
    const isEnterprise = process.env.NOVU_ENTERPRISE === 'true' || process.env.CI_EE_TEST === 'true';

    if (!isEnterprise) {
      return;
    }

    try {
      const manageTranslations = this.moduleRef.get(require('@novu/ee-translation')?.ManageTranslations, {
        strict: false,
      });

      await manageTranslations.execute({
        enabled: command.isTranslationEnabled,
        resourceId: workflowIdentifier,
        resourceType: LocalizationResourceEnum.WORKFLOW,
        organizationId: command.organizationId,
        environmentId: command.environmentId,
        userId: command.userId,
      });
    } catch (error) {
      this.logger.error(
        `Failed to ${command.isTranslationEnabled ? 'enable' : 'disable'} V2 translations for workflow`,
        {
          workflowIdentifier,
          enabled: command.isTranslationEnabled,
          organizationId: command.organizationId,
          error: error instanceof Error ? error.message : String(error),
        }
      );

      throw error;
    }
  }

  @Instrument()
  private async updateMessageTemplates(
    steps: NotificationStep[],
    command: UpdateWorkflowCommand,
    parentChangeId: string
  ) {
    let parentStepId: string | null = null;
    const templateMessages: NotificationStepEntity[] = [];

    for (const message of steps) {
      let messageTemplateId = message._id;

      if (!message.template) {
        throw new BadRequestException(`Something un-expected happened, template couldn't be found`);
      }

      const updatedVariants = await this.updateVariants(message.variants, command, parentChangeId!);

      const messageTemplatePayload: CreateMessageTemplateCommand | UpdateMessageTemplateCommand = {
        type: message.template.type,
        name: message.template.name,
        content: message.template.content,
        variables: message.template.variables,
        organizationId: command.organizationId,
        environmentId: command.environmentId,
        userId: command.userId,
        contentType: message.template.contentType,
        cta: message.template.cta,
        feedId: message.template.feedId ? message.template.feedId : undefined,
        layoutId: message.template.layoutId || null,
        subject: message.template.subject,
        title: message.template.title,
        preheader: message.template.preheader,
        senderName: message.template.senderName,
        actor: message.template.actor,
        parentChangeId,
        code: message?.template.code,
        controls: message?.template.controls,
        output: message?.template.output,
        workflowType: command.type,
      };

      let messageTemplateExist = message._templateId;

      if (!messageTemplateExist && isBridgeWorkflow(command.type)) {
        const stepMessageTemplate = await this.messageTemplateRepository.findOne({
          _environmentId: command.environmentId,
          stepId: message.stepId,
          _parentId: command.id,
        });
        messageTemplateExist = stepMessageTemplate?._id;
      }

      const updatedTemplate = messageTemplateExist
        ? await this.updateMessageTemplate.execute(
            UpdateMessageTemplateCommand.create({
              templateId: message._templateId!,
              ...messageTemplatePayload,
            })
          )
        : await this.createMessageTemplate.execute(CreateMessageTemplateCommand.create(messageTemplatePayload));

      if (!messageTemplateExist) {
        this.analyticsService.track('Workflow step added', command.userId, {
          _organization: command.organizationId,
          _environment: command.environmentId,
          workflowId: command.id,
          type: messageTemplatePayload.type,
        });
      }

      messageTemplateId = updatedTemplate._id;

      const partialNotificationStep = this.getPartialTemplateStep(
        messageTemplateId,
        parentStepId,
        message,
        updatedVariants
      );

      templateMessages.push(partialNotificationStep as NotificationStepEntity);

      parentStepId = messageTemplateId || null;
    }

    return templateMessages;
  }

  @Instrument()
  private updateTriggers(
    updatePayload: Partial<WorkflowWithPreferencesResponseDto>,
    steps: NotificationStep[]
  ): Partial<WorkflowWithPreferencesResponseDto> {
    const updatePayloadResult: Partial<WorkflowWithPreferencesResponseDto> = {
      ...updatePayload,
    };

    const contentService = new ContentService();
    const { variables, reservedVariables } = contentService.extractMessageVariables(steps);

    updatePayloadResult['triggers.0.variables'] = variables.map((i) => {
      return {
        name: i.name,
        type: i.type,
      };
    });

    updatePayloadResult['triggers.0.reservedVariables'] = reservedVariables.map((i) => {
      return {
        type: i.type,
        variables: i.variables.map((variable) => {
          return {
            name: variable.name,
            type: variable.type,
          };
        }),
      };
    });

    const subscribersVariables = contentService.extractSubscriberMessageVariables(steps);

    updatePayloadResult['triggers.0.subscriberVariables'] = subscribersVariables.map((i) => {
      return {
        name: i,
      };
    });

    return updatePayloadResult;
  }

  private getPartialTemplateStep(
    stepId: string | undefined,
    parentStepId: string | null,
    message: NotificationStep,
    updatedVariants: NotificationStepData[]
  ) {
    const partialNotificationStep: Partial<NotificationStepEntity> = {
      _id: stepId,
      _templateId: stepId,
      _parentId: parentStepId,
    };

    if (message.filters != null) {
      partialNotificationStep.filters = message.filters;
    }

    if (message.active != null) {
      partialNotificationStep.active = message.active;
    }

    if (message.metadata != null) {
      partialNotificationStep.metadata = message.metadata;
    }

    if (message.shouldStopOnFail != null) {
      partialNotificationStep.shouldStopOnFail = message.shouldStopOnFail;
    }

    if (message.replyCallback != null) {
      partialNotificationStep.replyCallback = message.replyCallback;
    }

    if (message.uuid) {
      partialNotificationStep.uuid = message.uuid;
    }

    if (message.name) {
      partialNotificationStep.name = message.name;
    }

    if (message.stepId) {
      partialNotificationStep.stepId = message.stepId;
    }

    if (updatedVariants.length) {
      partialNotificationStep.variants = updatedVariants;
    }

    if (message.issues) {
      partialNotificationStep.issues = message.issues;
    }

    return partialNotificationStep;
  }

  private cleanNotificationTemplate(notificationTemplateWithStepTemplate: NotificationTemplateEntity) {
    const notificationTemplate = {
      ...notificationTemplateWithStepTemplate,
    };

    notificationTemplate.steps = notificationTemplateWithStepTemplate.steps.map((step) => {
      const { template, ...rest } = step;

      return rest;
    });

    return notificationTemplate;
  }

  private getRemovedSteps(existingSteps: NotificationStepEntity[], newSteps: NotificationStep[]) {
    const existingStepsIds = (existingSteps || []).flatMap((step) => [
      step._templateId,
      ...(step.variants || []).flatMap((variant) => variant._templateId),
    ]);

    const newStepsIds = (newSteps || []).flatMap((step) => [
      step._templateId,
      ...(step.variants || []).flatMap((variant) => variant._templateId),
    ]);

    return existingStepsIds.filter((id) => !newStepsIds.includes(id));
  }

  private async updateVariants(
    variants: NotificationStepVariantCommand[] | undefined,
    command: UpdateWorkflowCommand,
    parentChangeId: string
  ): Promise<NotificationStepData[]> {
    if (!variants?.length) return [];

    const variantsList: NotificationStepData[] = [];
    let parentVariantId: string | null = null;

    for (const variant of variants) {
      if (!variant.template) throw new BadRequestException(`Unexpected error: variants message template is missing`);

      const messageTemplatePayload: CreateMessageTemplateCommand | UpdateMessageTemplateCommand = {
        organizationId: command.organizationId,
        environmentId: command.environmentId,
        userId: command.userId,
        type: variant.template.type,
        name: variant.template.name,
        content: variant.template.content,
        variables: variant.template.variables,
        contentType: variant.template.contentType,
        cta: variant.template.cta,
        subject: variant.template.subject,
        title: variant.template.title,
        feedId: variant.template.feedId ? variant.template.feedId : undefined,
        layoutId: variant.template.layoutId || null,
        preheader: variant.template.preheader,
        senderName: variant.template.senderName,
        actor: variant.template.actor,
        parentChangeId,
        workflowType: command.type,
      };

      const messageTemplateExist = variant._templateId;
      const updatedVariant = messageTemplateExist
        ? await this.updateMessageTemplate.execute(
            UpdateMessageTemplateCommand.create({
              templateId: variant._templateId!,
              ...messageTemplatePayload,
            })
          )
        : await this.createMessageTemplate.execute(CreateMessageTemplateCommand.create(messageTemplatePayload));

      if (!updatedVariant._id)
        throw new BadRequestException(`Unexpected error: variants message template was not created`);

      variantsList.push({
        _id: updatedVariant._id,
        _templateId: updatedVariant._id,
        filters: variant.filters,
        _parentId: parentVariantId,
        active: variant.active,
        shouldStopOnFail: variant.shouldStopOnFail,
        replyCallback: variant.replyCallback,
        uuid: variant.uuid,
        name: variant.name,
        metadata: variant.metadata,
      });

      if (updatedVariant._id) {
        parentVariantId = updatedVariant._id;
      }
    }

    return variantsList;
  }

  @Instrument()
  private async deleteRemovedSteps(
    existingSteps: NotificationStepEntity[] | NotificationStepData[] | undefined,
    command: UpdateWorkflowCommand,
    parentChangeId: string
  ) {
    const removedStepsIds = this.getRemovedSteps(existingSteps || [], command.steps || []);

    for (const id of removedStepsIds) {
      await this.deleteMessageTemplate.execute(
        DeleteMessageTemplateCommand.create({
          organizationId: command.organizationId,
          environmentId: command.environmentId,
          userId: command.userId,
          messageTemplateId: id,
          parentChangeId,
          workflowType: command.type,
        })
      );

      await this.controlValuesRepository.delete({
        _environmentId: command.environmentId,
        _organizationId: command.organizationId,
        _workflowId: command.id,
        _stepId: id,
        level: ControlValuesLevelEnum.STEP_CONTROLS,
      });
    }
  }
}
