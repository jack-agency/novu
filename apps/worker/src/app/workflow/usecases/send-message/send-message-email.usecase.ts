import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { addBreadcrumb } from '@sentry/node';
import inlineCss from 'inline-css';

import {
  CompileEmailTemplate,
  CompileEmailTemplateCommand,
  CreateExecutionDetails,
  CreateExecutionDetailsCommand,
  DetailEnum,
  FeatureFlagsService,
  GetNovuProviderCredentials,
  InstrumentUsecase,
  MailFactory,
  SelectIntegration,
  SelectVariant,
} from '@novu/application-generic';
import {
  EnvironmentEntity,
  EnvironmentRepository,
  IntegrationEntity,
  LayoutRepository,
  MessageEntity,
  MessageRepository,
  OrganizationEntity,
  SubscriberRepository,
  UserEntity,
} from '@novu/dal';
import { EmailOutput } from '@novu/framework/internal';
import {
  ChannelTypeEnum,
  EmailProviderIdEnum,
  ExecutionDetailsSourceEnum,
  ExecutionDetailsStatusEnum,
  FeatureFlagsKeysEnum,
  IAttachmentOptions,
  IEmailOptions,
} from '@novu/shared';

import { PlatformException } from '../../../shared/utils';
import { SendMessageResult } from './send-message-type.usecase';
import { SendMessageBase } from './send-message.base';
import { SendMessageCommand } from './send-message.command';

const LOG_CONTEXT = 'SendMessageEmail';

@Injectable()
export class SendMessageEmail extends SendMessageBase {
  channelType = ChannelTypeEnum.EMAIL;

  constructor(
    protected environmentRepository: EnvironmentRepository,
    protected subscriberRepository: SubscriberRepository,
    protected messageRepository: MessageRepository,
    protected layoutRepository: LayoutRepository,
    protected createExecutionDetails: CreateExecutionDetails,
    private compileEmailTemplateUsecase: CompileEmailTemplate,
    protected selectIntegration: SelectIntegration,
    protected getNovuProviderCredentials: GetNovuProviderCredentials,
    protected selectVariant: SelectVariant,
    protected moduleRef: ModuleRef,
    private featureFlagService: FeatureFlagsService
  ) {
    super(
      messageRepository,
      createExecutionDetails,
      subscriberRepository,
      selectIntegration,
      getNovuProviderCredentials,
      selectVariant,
      moduleRef
    );
  }

  @InstrumentUsecase()
  public async execute(command: SendMessageCommand): Promise<SendMessageResult> {
    let integration: IntegrationEntity | undefined;
    const { subscriber } = command.compileContext;
    const email = command.overrides?.email?.toRecipient || subscriber.email;

    const overrideSelectedIntegration = command.overrides?.email?.integrationIdentifier;
    try {
      integration = await this.getIntegration({
        organizationId: command.organizationId,
        environmentId: command.environmentId,
        channelType: ChannelTypeEnum.EMAIL,
        userId: command.userId,
        recipientEmail: email,
        identifier: overrideSelectedIntegration as string,
        filterData: {
          tenant: command.job.tenant,
        },
      });
    } catch (e) {
      let detailEnum = DetailEnum.LIMIT_PASSED_NOVU_INTEGRATION;

      if (e.message.includes('does not match the current logged-in user')) {
        detailEnum = DetailEnum.SUBSCRIBER_NOT_MEMBER_OF_ORGANIZATION;
      }

      await this.createExecutionDetails.execute(
        CreateExecutionDetailsCommand.create({
          ...CreateExecutionDetailsCommand.getDetailsFromJob(command.job),
          detail: detailEnum,
          source: ExecutionDetailsSourceEnum.INTERNAL,
          status: ExecutionDetailsStatusEnum.FAILED,
          raw: JSON.stringify({ message: e.message }),
          isTest: false,
          isRetry: false,
        })
      );

      return {
        status: 'failed',
        reason: DetailEnum.LIMIT_PASSED_NOVU_INTEGRATION,
      };
    }

    const { step } = command;

    if (!step) throw new PlatformException('Email channel step not found');
    if (!step.template) throw new PlatformException('Email channel template not found');

    addBreadcrumb({
      message: 'Sending Email',
    });

    if (!integration) {
      await this.createExecutionDetails.execute(
        CreateExecutionDetailsCommand.create({
          ...CreateExecutionDetailsCommand.getDetailsFromJob(command.job),
          detail: DetailEnum.SUBSCRIBER_NO_ACTIVE_INTEGRATION,
          source: ExecutionDetailsSourceEnum.INTERNAL,
          status: ExecutionDetailsStatusEnum.FAILED,
          isTest: false,
          isRetry: false,
          ...(overrideSelectedIntegration
            ? {
                raw: JSON.stringify({
                  integrationIdentifier: overrideSelectedIntegration,
                }),
              }
            : {}),
        })
      );

      return {
        status: 'failed',
        reason: DetailEnum.SUBSCRIBER_NO_ACTIVE_INTEGRATION,
      };
    }

    const [template, overrideLayoutId] = await Promise.all([
      this.processVariants(command),
      this.getOverrideLayoutId(command),
      this.sendSelectedIntegrationExecution(command.job, integration),
    ]);

    if (template) {
      step.template = template;
    }

    const overrides: Record<string, any> = {
      ...(command.overrides?.email || {}),
      ...(command.overrides?.[integration?.providerId] || {}),
    };
    const bridgeOutputs = command.bridgeData?.outputs;

    let html;
    let subject = (bridgeOutputs as EmailOutput)?.subject || step?.template?.subject || '';
    let content;
    let senderName;

    const payload = {
      senderName: step.template.senderName,
      subject,
      preheader: step.template.preheader,
      content: step.template.content,
      layoutId: overrideLayoutId ?? step.template._layoutId,
      contentType: step.template.contentType ? step.template.contentType : 'editor',
      payload: this.getCompilePayload(command.compileContext),
    };

    const messagePayload = { ...command.payload };
    delete messagePayload.attachments;

    const message: MessageEntity = await this.messageRepository.create({
      _notificationId: command.notificationId,
      _environmentId: command.environmentId,
      _organizationId: command.organizationId,
      _subscriberId: command._subscriberId,
      _templateId: command._templateId,
      _messageTemplateId: step.template._id,
      subject,
      channel: ChannelTypeEnum.EMAIL,
      transactionId: command.transactionId,
      email,
      providerId: integration?.providerId,
      payload: messagePayload,
      overrides,
      templateIdentifier: command.identifier,
      _jobId: command.jobId,
      tags: command.tags,
    });

    let replyToAddress: string | undefined;
    if (command.step.replyCallback?.active) {
      const replyTo = await this.getReplyTo(command, message._id);

      if (replyTo) {
        replyToAddress = replyTo;

        if (payload.payload.step) {
          payload.payload.step.reply_to_address = replyTo;
        }
      }
    }

    try {
      const i18nInstance = await this.initiateTranslations(
        command.environmentId,
        command.organizationId,
        subscriber.locale
      );

      if (!command.bridgeData) {
        ({ html, content, subject, senderName } = await this.compileEmailTemplateUsecase.execute(
          CompileEmailTemplateCommand.create({
            environmentId: command.environmentId,
            organizationId: command.organizationId,
            userId: command.userId,
            ...payload,
          }),
          i18nInstance
        ));

        // TODO: remove as part of https://linear.app/novu/issue/NV-4117/email-html-content-issue-in-mobile-devices
        const shouldDisableInlineCss = await this.featureFlagService.getFlag({
          key: FeatureFlagsKeysEnum.IS_EMAIL_INLINE_CSS_DISABLED,
          defaultValue: false,
          environment: { _id: command.environmentId } as EnvironmentEntity,
          organization: { _id: command.organizationId } as OrganizationEntity,
          user: { _id: command.userId } as UserEntity,
        });

        if (!shouldDisableInlineCss) {
          // this is causing rendering issues in Gmail (especially when media queries are used), so we are disabling it
          html = await inlineCss(html, {
            // Used for style sheet links that starts with / so should not be needed in our case.
            url: ' ',
          });
        }
      }
    } catch (error) {
      Logger.error(
        { payload, error },
        'Compiling the email template or storing it or inlining it has failed',
        LOG_CONTEXT
      );
      await this.sendErrorHandlebars(command.job, error.message);

      return {
        status: 'failed',
        reason: DetailEnum.MESSAGE_CONTENT_NOT_GENERATED,
      };
    }

    if (this.storeContent()) {
      await this.messageRepository.update(
        {
          _id: message._id,
          _environmentId: command.environmentId,
        },
        {
          $set: {
            subject,
            content: (bridgeOutputs as EmailOutput)?.body || content,
          },
        }
      );
    }

    await this.createExecutionDetails.execute(
      CreateExecutionDetailsCommand.create({
        ...CreateExecutionDetailsCommand.getDetailsFromJob(command.job),
        detail: DetailEnum.MESSAGE_CREATED,
        source: ExecutionDetailsSourceEnum.INTERNAL,
        status: ExecutionDetailsStatusEnum.PENDING,
        messageId: message._id,
        isTest: false,
        isRetry: false,
        raw: this.storeContent() ? JSON.stringify(payload) : null,
      })
    );

    const attachments = (<IAttachmentOptions[]>command.payload.attachments)?.map(
      (attachment) =>
        <IAttachmentOptions>{
          file: attachment.file,
          mime: attachment.mime,
          name: attachment.name,
          channels: attachment.channels,
        }
    );

    const mailData: IEmailOptions = createMailData(
      {
        to: email,
        subject,
        html: (bridgeOutputs as EmailOutput)?.body || html,
        from: integration?.credentials.from || 'no-reply@novu.co',
        attachments,
        senderName,
        id: message._id,
        replyTo: replyToAddress,
        notificationDetails: {
          transactionId: command.transactionId,
          workflowIdentifier: command.identifier,
          subscriberId: subscriber.subscriberId,
        },
      },
      overrides || {}
    );

    if (command.overrides?.email?.replyTo) {
      mailData.replyTo = command.overrides?.email?.replyTo as string;
    }

    if (integration.providerId === EmailProviderIdEnum.EmailWebhook) {
      mailData.payloadDetails = payload;
    }

    if (!email || !integration) {
      return await this.sendErrors(email, integration, message, command);
    }

    return await this.sendMessage(integration, mailData, message, command);
  }

  private async getReplyTo(command: SendMessageCommand, messageId: string): Promise<string | null> {
    if (!command.step.replyCallback?.url) {
      await this.createExecutionDetails.execute(
        CreateExecutionDetailsCommand.create({
          ...CreateExecutionDetailsCommand.getDetailsFromJob(command.job),
          messageId,
          detail: DetailEnum.REPLY_CALLBACK_MISSING_REPLAY_CALLBACK_URL,
          source: ExecutionDetailsSourceEnum.INTERNAL,
          status: ExecutionDetailsStatusEnum.WARNING,
          isTest: false,
          isRetry: false,
        })
      );

      return null;
    }

    const environment = await this.environmentRepository.findOne({ _id: command.environmentId });
    if (!environment) {
      throw new PlatformException(`Environment ${command.environmentId} is not found`);
    }

    if (environment.dns?.mxRecordConfigured && environment.dns?.inboundParseDomain) {
      return getReplyToAddress(command.transactionId, environment._id, environment?.dns?.inboundParseDomain);
    } else {
      const detailEnum =
        // eslint-disable-next-line no-nested-ternary
        !environment.dns?.mxRecordConfigured && !environment.dns?.inboundParseDomain
          ? DetailEnum.REPLY_CALLBACK_NOT_CONFIGURATION
          : !environment.dns?.mxRecordConfigured
            ? DetailEnum.REPLY_CALLBACK_MISSING_MX_RECORD_CONFIGURATION
            : DetailEnum.REPLY_CALLBACK_MISSING_MX_ROUTE_DOMAIN_CONFIGURATION;

      await this.createExecutionDetails.execute(
        CreateExecutionDetailsCommand.create({
          ...CreateExecutionDetailsCommand.getDetailsFromJob(command.job),
          messageId,
          detail: detailEnum,
          source: ExecutionDetailsSourceEnum.INTERNAL,
          status: ExecutionDetailsStatusEnum.WARNING,
          isTest: false,
          isRetry: false,
        })
      );

      return null;
    }
  }

  private async sendErrors(
    email,
    integration,
    message: MessageEntity,
    command: SendMessageCommand
  ): Promise<SendMessageResult> {
    const errorMessage = 'Subscriber does not have an';
    const status = 'warning';
    const errorId = 'mail_unexpected_error';

    if (!email) {
      const mailErrorMessage = `${errorMessage} email address`;

      await this.sendErrorStatus(message, status, errorId, mailErrorMessage, command);

      await this.createExecutionDetails.execute(
        CreateExecutionDetailsCommand.create({
          ...CreateExecutionDetailsCommand.getDetailsFromJob(command.job),
          messageId: message._id,
          detail: DetailEnum.SUBSCRIBER_NO_CHANNEL_DETAILS,
          source: ExecutionDetailsSourceEnum.INTERNAL,
          status: ExecutionDetailsStatusEnum.FAILED,
          isTest: false,
          isRetry: false,
        })
      );

      return {
        status: 'failed',
        reason: DetailEnum.SUBSCRIBER_NO_CHANNEL_DETAILS,
      };
    }

    if (!integration) {
      const integrationError = `${errorMessage} active email integration not found`;

      await this.sendErrorStatus(message, status, errorId, integrationError, command);

      await this.createExecutionDetails.execute(
        CreateExecutionDetailsCommand.create({
          ...CreateExecutionDetailsCommand.getDetailsFromJob(command.job),
          messageId: message._id,
          detail: DetailEnum.SUBSCRIBER_NO_ACTIVE_INTEGRATION,
          source: ExecutionDetailsSourceEnum.INTERNAL,
          status: ExecutionDetailsStatusEnum.FAILED,
          isTest: false,
          isRetry: false,
        })
      );

      return {
        status: 'failed',
        reason: DetailEnum.SUBSCRIBER_NO_ACTIVE_INTEGRATION,
      };
    }

    return {
      status: 'failed',
      reason: DetailEnum.PROVIDER_ERROR,
    };
  }

  private async sendMessage(
    integration: IntegrationEntity,
    mailData: IEmailOptions,
    message: MessageEntity,
    command: SendMessageCommand
  ): Promise<SendMessageResult> {
    const mailFactory = new MailFactory();
    const mailHandler = mailFactory.getHandler(this.buildFactoryIntegration(integration), mailData.from);

    try {
      const result = await mailHandler.send({
        ...mailData,
        bridgeProviderData: this.combineOverrides(
          command.bridgeData,
          command.overrides,
          command.step.stepId,
          integration.providerId
        ),
      });

      Logger.verbose({ command }, 'Email message has been sent', LOG_CONTEXT);

      await this.createExecutionDetails.execute(
        CreateExecutionDetailsCommand.create({
          ...CreateExecutionDetailsCommand.getDetailsFromJob(command.job),
          messageId: message._id,
          detail: DetailEnum.MESSAGE_SENT,
          source: ExecutionDetailsSourceEnum.INTERNAL,
          status: ExecutionDetailsStatusEnum.SUCCESS,
          isTest: false,
          isRetry: false,
          raw: JSON.stringify(result),
        })
      );

      Logger.verbose({ command }, 'Execution details of sending an email message have been stored', LOG_CONTEXT);

      if (!result?.id) {
        return {
          status: 'failed',
          reason: DetailEnum.PROVIDER_ERROR,
        };
      }

      await this.messageRepository.update(
        { _environmentId: command.environmentId, _id: message._id },
        {
          $set: {
            identifier: result.id,
          },
        }
      );

      return {
        status: 'success',
      };
    } catch (error) {
      await this.sendErrorStatus(
        message,
        'error',
        'mail_unexpected_error',
        error.message || error.name || 'Error while sending email with provider',
        command,
        error
      );

      /*
       * Axios Error, to provide better readability, otherwise stringify ignores response object
       * TODO: Handle this at the handler level globally
       */
      if (error?.isAxiosError && error.response) {
        // eslint-disable-next-line no-ex-assign
        error = error.response;
      }

      await this.createExecutionDetails.execute(
        CreateExecutionDetailsCommand.create({
          ...CreateExecutionDetailsCommand.getDetailsFromJob(command.job),
          messageId: message._id,
          detail: DetailEnum.PROVIDER_ERROR,
          source: ExecutionDetailsSourceEnum.INTERNAL,
          status: ExecutionDetailsStatusEnum.FAILED,
          isTest: false,
          isRetry: false,
          raw: JSON.stringify(error) === '{}' ? JSON.stringify({ message: error.message }) : JSON.stringify(error),
        })
      );

      return {
        status: 'failed',
        reason: DetailEnum.PROVIDER_ERROR,
      };
    }
  }

  private async getOverrideLayoutId(command: SendMessageCommand) {
    const overrideLayoutIdentifier = command.overrides?.layoutIdentifier;

    if (overrideLayoutIdentifier) {
      const layoutOverride = await this.layoutRepository.findOne(
        {
          _environmentId: command.environmentId,
          identifier: overrideLayoutIdentifier,
        },
        '_id'
      );
      if (!layoutOverride) {
        await this.createExecutionDetails.execute(
          CreateExecutionDetailsCommand.create({
            ...CreateExecutionDetailsCommand.getDetailsFromJob(command.job),
            detail: DetailEnum.LAYOUT_NOT_FOUND,
            source: ExecutionDetailsSourceEnum.INTERNAL,
            status: ExecutionDetailsStatusEnum.FAILED,
            isTest: false,
            isRetry: false,
            raw: JSON.stringify({
              layoutIdentifier: overrideLayoutIdentifier,
            }),
          })
        );
      }

      return layoutOverride?._id;
    }
  }

  public buildFactoryIntegration(integration: IntegrationEntity, senderName?: string) {
    return {
      ...integration,
      credentials: {
        ...integration.credentials,
      },
      providerId: integration.providerId,
    };
  }
}

export const createMailData = (options: IEmailOptions, overrides: Record<string, any>): IEmailOptions => {
  const filterDuplicate = (prev: string[], current: string) => (prev.includes(current) ? prev : [...prev, current]);

  let to = Array.isArray(options.to) ? options.to : [options.to];
  to = [...to, ...(overrides?.to || [])];
  to = to.reduce(filterDuplicate, []);
  const ipPoolName = overrides?.ipPoolName ? { ipPoolName: overrides?.ipPoolName } : {};

  return {
    ...options,
    to,
    from: overrides?.from || options.from,
    text: overrides?.text,
    html: overrides?.html || overrides?.text || options.html,
    cc: overrides?.cc || [],
    bcc: overrides?.bcc || [],
    ...ipPoolName,
    senderName: overrides?.senderName || options.senderName,
    subject: overrides?.subject || options.subject,
    customData: overrides?.customData || {},
    headers: overrides?.headers || {},
  };
};

export function getReplyToAddress(transactionId: string, environmentId: string, inboundParseDomain: string) {
  const userNamePrefix = 'parse';
  const userNameDelimiter = '-nv-e=';

  return `${userNamePrefix}+${transactionId}${userNameDelimiter}${environmentId}@${inboundParseDomain}`;
}
