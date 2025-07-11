import { Novu } from '@novu/api';
import { CreateIntegrationRequestDto, TriggerEventResponseDto } from '@novu/api/models/components';
import { SubscriberPayloadDto } from '@novu/api/src/models/components/subscriberpayloaddto';
import { DetailEnum } from '@novu/application-generic';
import {
  EnvironmentRepository,
  ExecutionDetailsRepository,
  IntegrationRepository,
  JobRepository,
  JobStatusEnum,
  MessageRepository,
  NotificationRepository,
  NotificationTemplateEntity,
  NotificationTemplateRepository,
  SubscriberEntity,
  SubscriberRepository,
  TenantRepository,
  CommunityOrganizationRepository,
} from '@novu/dal';
import {
  ActorTypeEnum,
  ChannelTypeEnum,
  ChatProviderIdEnum,
  CreateWorkflowDto,
  DelayTypeEnum,
  DigestUnitEnum,
  EmailBlockTypeEnum,
  EmailProviderIdEnum,
  ExecutionDetailsStatusEnum,
  FieldLogicalOperatorEnum,
  FieldOperatorEnum,
  FilterPartTypeEnum,
  IEmailBlock,
  InAppProviderIdEnum,
  PreviousStepTypeEnum,
  SmsProviderIdEnum,
  StepTypeEnum,
  SystemAvatarIconEnum,
  TemplateVariableTypeEnum,
  WorkflowCreationSourceEnum,
  WorkflowResponseDto,
  ApiServiceLevelEnum,
} from '@novu/shared';
import { EmailEventStatusEnum } from '@novu/stateless';
import { SubscribersService, UserSession, WorkflowOverrideService } from '@novu/testing';
import { expect } from 'chai';
import { v4 as uuid } from 'uuid';
import { initNovuClassSdk } from '../../shared/helpers/e2e/sdk/e2e-sdk.helper';
import { createTenant } from '../../tenant/e2e/create-tenant.e2e';

const promiseTimeout = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

describe('Trigger event - /v1/events/trigger (POST) #novu-v2', function () {
  let session: UserSession;
  let template: NotificationTemplateEntity;
  let subscriber: SubscriberEntity;
  let subscriberService: SubscribersService;
  let workflowOverrideService: WorkflowOverrideService;
  const notificationRepository = new NotificationRepository();
  const notificationTemplateRepository = new NotificationTemplateRepository();
  const messageRepository = new MessageRepository();
  const subscriberRepository = new SubscriberRepository();
  const integrationRepository = new IntegrationRepository();
  const jobRepository = new JobRepository();
  const executionDetailsRepository = new ExecutionDetailsRepository();
  const environmentRepository = new EnvironmentRepository();
  const tenantRepository = new TenantRepository();
  let novuClient: Novu;

  beforeEach(async () => {
    session = new UserSession();
    await session.initialize();
    template = await session.createTemplate();
    subscriberService = new SubscribersService(session.organization._id, session.environment._id);
    subscriber = await subscriberService.createSubscriber();
    workflowOverrideService = new WorkflowOverrideService({
      organizationId: session.organization._id,
      environmentId: session.environment._id,
    });
    novuClient = initNovuClassSdk(session);
  });

  describe(`Trigger Event - /v1/events/trigger (POST)`, function () {
    it('should filter delay step', async function () {
      const firstStepUuid = uuid();
      template = await session.createTemplate({
        steps: [
          {
            type: StepTypeEnum.EMAIL,
            name: 'Message Name',
            subject: 'Test email subject',
            content: [{ type: EmailBlockTypeEnum.TEXT, content: 'This is a sample text block' }],
            uuid: firstStepUuid,
          },
          {
            type: StepTypeEnum.DELAY,
            content: '',
            metadata: {
              unit: DigestUnitEnum.SECONDS,
              amount: 2,
              type: DelayTypeEnum.REGULAR,
            },
            filters: [
              {
                isNegated: false,
                type: 'GROUP',
                value: FieldLogicalOperatorEnum.AND,
                children: [
                  {
                    on: FilterPartTypeEnum.PAYLOAD,
                    operator: FieldOperatorEnum.IS_DEFINED,
                    field: 'exclude',
                    value: '',
                  },
                ],
              },
            ],
          },
          {
            type: StepTypeEnum.EMAIL,
            name: 'Message Name',
            subject: 'Test email subject',
            content: [{ type: EmailBlockTypeEnum.TEXT, content: 'This is a sample text block' }],
          },
        ],
      });

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {
          customVar: 'Testing of User Name',
        },
      });

      await session.waitForJobCompletion(template._id);

      const messagesAfter = await messageRepository.find({
        _environmentId: session.environment._id,
        _subscriberId: subscriber._id,
        channel: StepTypeEnum.EMAIL,
      });

      expect(messagesAfter.length).to.equal(2);

      const executionDetails = await executionDetailsRepository.find({
        _environmentId: session.environment._id,
        _notificationTemplateId: template?._id,
        channel: StepTypeEnum.DELAY,
        detail: DetailEnum.FILTER_STEPS,
      });

      expect(executionDetails.length).to.equal(1);
    });

    it('should filter a delay that is the first step in the workflow', async function () {
      template = await session.createTemplate({
        steps: [
          {
            type: StepTypeEnum.DELAY,
            content: '',
            metadata: {
              unit: DigestUnitEnum.SECONDS,
              amount: 2,
              type: DelayTypeEnum.REGULAR,
            },
            filters: [
              {
                isNegated: false,
                type: 'GROUP',
                value: FieldLogicalOperatorEnum.AND,
                children: [
                  {
                    on: FilterPartTypeEnum.PAYLOAD,
                    operator: FieldOperatorEnum.IS_DEFINED,
                    field: 'exclude',
                    value: '',
                  },
                ],
              },
            ],
          },
          {
            type: StepTypeEnum.EMAIL,
            name: 'Message Name',
            subject: 'Test email subject',
            content: [{ type: EmailBlockTypeEnum.TEXT, content: 'This is a sample text block' }],
          },
        ],
      });

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {
          customVar: 'Testing of User Name',
        },
      });

      await session.waitForJobCompletion(template._id);

      const messagesAfter = await messageRepository.find({
        _environmentId: session.environment._id,
        _subscriberId: subscriber._id,
        channel: StepTypeEnum.EMAIL,
      });

      expect(messagesAfter.length).to.equal(1);

      const executionDetails = await executionDetailsRepository.find({
        _environmentId: session.environment._id,
        _notificationTemplateId: template?._id,
        channel: StepTypeEnum.DELAY,
        detail: DetailEnum.FILTER_STEPS,
      });

      expect(executionDetails.length).to.equal(1);
    });

    it('should filter digest step', async function () {
      const firstStepUuid = uuid();
      template = await session.createTemplate({
        steps: [
          {
            type: StepTypeEnum.EMAIL,
            name: 'Message Name',
            subject: 'Test email subject',
            content: [{ type: EmailBlockTypeEnum.TEXT, content: 'This is a sample text block' }],
            uuid: firstStepUuid,
          },
          {
            type: StepTypeEnum.DIGEST,
            content: '',
            metadata: {
              unit: DigestUnitEnum.SECONDS,
              amount: 2,
              type: DelayTypeEnum.REGULAR,
            },
            filters: [
              {
                isNegated: false,
                type: 'GROUP',
                value: FieldLogicalOperatorEnum.AND,
                children: [
                  {
                    on: FilterPartTypeEnum.PAYLOAD,
                    operator: FieldOperatorEnum.IS_DEFINED,
                    field: 'exclude',
                    value: '',
                  },
                ],
              },
            ],
          },
          {
            type: StepTypeEnum.EMAIL,
            name: 'Message Name',
            subject: 'Test email subject',
            content: [{ type: EmailBlockTypeEnum.TEXT, content: 'This is a sample text block' }],
          },
        ],
      });

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {
          customVar: 'Testing of User Name',
        },
      });

      await session.waitForJobCompletion(template._id);

      const messagesAfter = await messageRepository.find({
        _environmentId: session.environment._id,
        _subscriberId: subscriber._id,
        channel: StepTypeEnum.EMAIL,
      });

      expect(messagesAfter.length).to.equal(2);

      const executionDetails = await executionDetailsRepository.find({
        _environmentId: session.environment._id,
        _notificationTemplateId: template?._id,
        channel: StepTypeEnum.DIGEST,
        detail: DetailEnum.FILTER_STEPS,
      });

      expect(executionDetails.length).to.equal(1);
    });

    it('should filter multiple digest steps', async function () {
      const firstStepUuid = uuid();
      template = await session.createTemplate({
        steps: [
          {
            type: StepTypeEnum.EMAIL,
            name: 'Message Name',
            subject: 'Test email subject',
            content: [{ type: EmailBlockTypeEnum.TEXT, content: 'This is a sample text block' }],
            uuid: firstStepUuid,
          },
          {
            type: StepTypeEnum.DIGEST,
            content: '',
            metadata: {
              unit: DigestUnitEnum.SECONDS,
              amount: 2,
              type: DelayTypeEnum.REGULAR,
            },
            filters: [
              {
                isNegated: false,
                type: 'GROUP',
                value: FieldLogicalOperatorEnum.AND,
                children: [
                  {
                    field: 'digest_type',
                    value: '1',
                    operator: FieldOperatorEnum.EQUAL,
                    on: FilterPartTypeEnum.PAYLOAD,
                  },
                ],
              },
            ],
          },
          {
            type: StepTypeEnum.DIGEST,
            content: '',
            metadata: {
              unit: DigestUnitEnum.SECONDS,
              amount: 2,
              type: DelayTypeEnum.REGULAR,
            },
            filters: [
              {
                isNegated: false,
                type: 'GROUP',
                value: FieldLogicalOperatorEnum.AND,
                children: [
                  {
                    field: 'digest_type',
                    value: '2',
                    operator: FieldOperatorEnum.EQUAL,
                    on: FilterPartTypeEnum.PAYLOAD,
                  },
                ],
              },
            ],
          },
          {
            type: StepTypeEnum.DIGEST,
            content: '',
            metadata: {
              unit: DigestUnitEnum.SECONDS,
              amount: 2,
              type: DelayTypeEnum.REGULAR,
            },
            filters: [
              {
                isNegated: false,
                type: 'GROUP',
                value: FieldLogicalOperatorEnum.AND,
                children: [
                  {
                    field: 'digest_type',
                    value: '3',
                    operator: FieldOperatorEnum.EQUAL,
                    on: FilterPartTypeEnum.PAYLOAD,
                  },
                ],
              },
            ],
          },
          {
            type: StepTypeEnum.EMAIL,
            name: 'Message Name',
            subject: 'Test email subject',
            content: [{ type: EmailBlockTypeEnum.TEXT, content: 'This is a sample text block' }],
          },
        ],
      });

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {
          customVar: 'Testing of User Name',
          digest_type: '2',
        },
      });

      await session.waitForJobCompletion(template._id);

      const messagesAfter = await messageRepository.find({
        _environmentId: session.environment._id,
        _templateId: template?._id,
        _subscriberId: subscriber._id,
        channel: StepTypeEnum.EMAIL,
      });

      expect(messagesAfter.length).to.equal(2);

      const executionDetails = await executionDetailsRepository.find({
        _environmentId: session.environment._id,
        _notificationTemplateId: template?._id,
        channel: StepTypeEnum.DIGEST,
        detail: DetailEnum.FILTER_STEPS,
      });

      expect(executionDetails.length).to.equal(2);
    });

    it('should not filter digest step', async function () {
      const firstStepUuid = uuid();
      template = await session.createTemplate({
        steps: [
          {
            type: StepTypeEnum.EMAIL,
            name: 'Message Name',
            subject: 'Test email subject',
            content: [{ type: EmailBlockTypeEnum.TEXT, content: 'This is a sample text block' }],
            uuid: firstStepUuid,
          },
          {
            type: StepTypeEnum.DIGEST,
            content: '',
            metadata: {
              unit: DigestUnitEnum.SECONDS,
              amount: 2,
              type: DelayTypeEnum.REGULAR,
            },
            filters: [
              {
                isNegated: false,
                type: 'GROUP',
                value: FieldLogicalOperatorEnum.AND,
                children: [
                  {
                    on: FilterPartTypeEnum.PAYLOAD,
                    operator: FieldOperatorEnum.IS_DEFINED,
                    field: 'exclude',
                    value: '',
                  },
                ],
              },
            ],
          },
          {
            type: StepTypeEnum.EMAIL,
            name: 'Message Name',
            subject: 'Test email subject',
            content: [{ type: EmailBlockTypeEnum.TEXT, content: 'This is a sample text block' }],
          },
        ],
      });

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {
          customVar: 'Testing of User Name',
          exclude: false,
        },
      });

      await session.waitForJobCompletion(template._id);

      const messagesAfter = await messageRepository.find({
        _environmentId: session.environment._id,
        _subscriberId: subscriber._id,
        channel: StepTypeEnum.EMAIL,
      });

      expect(messagesAfter.length).to.equal(2);

      const executionDetails = await executionDetailsRepository.find({
        _environmentId: session.environment._id,
        _notificationTemplateId: template?._id,
        channel: StepTypeEnum.DIGEST,
        detail: DetailEnum.FILTER_STEPS,
      });

      expect(executionDetails.length).to.equal(0);
    });

    it('should digest events with filters', async function () {
      template = await session.createTemplate({
        steps: [
          {
            type: StepTypeEnum.DIGEST,
            content: '',
            metadata: {
              unit: DigestUnitEnum.SECONDS,
              amount: 2,
              type: DelayTypeEnum.REGULAR,
            },
            filters: [
              {
                isNegated: false,
                type: 'GROUP',
                value: FieldLogicalOperatorEnum.AND,
                children: [
                  {
                    on: FilterPartTypeEnum.PAYLOAD,
                    operator: FieldOperatorEnum.IS_DEFINED,
                    field: 'exclude',
                    value: '',
                  },
                ],
              },
            ],
          },
          {
            type: StepTypeEnum.SMS,
            content: 'total digested: {{step.total_count}}',
          },
        ],
      });

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {
          exclude: false,
        },
      });
      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {
          exclude: false,
        },
      });

      await session.waitForJobCompletion(template._id);

      const messagesAfter = await messageRepository.find({
        _environmentId: session.environment._id,
        _subscriberId: subscriber._id,
        channel: StepTypeEnum.SMS,
      });

      expect(messagesAfter.length).to.equal(1);
      expect(messagesAfter && messagesAfter[0].content).to.include('total digested: 2');

      const executionDetails = await executionDetailsRepository.find({
        _environmentId: session.environment._id,
        _notificationTemplateId: template?._id,
        channel: StepTypeEnum.DIGEST,
        detail: DetailEnum.FILTER_STEPS,
      });

      expect(executionDetails.length).to.equal(0);
    });

    // TODO: Fix this test
    it.skip('should not aggregate a filtered digest into a non filtered digest', async function () {
      template = await session.createTemplate({
        steps: [
          {
            type: StepTypeEnum.DIGEST,
            content: '',
            metadata: {
              unit: DigestUnitEnum.SECONDS,
              amount: 2,
              type: DelayTypeEnum.REGULAR,
            },
            filters: [
              {
                isNegated: false,
                type: 'GROUP',
                value: FieldLogicalOperatorEnum.AND,
                children: [
                  {
                    on: FilterPartTypeEnum.PAYLOAD,
                    operator: FieldOperatorEnum.IS_DEFINED,
                    field: 'exclude',
                    value: '',
                  },
                ],
              },
            ],
          },
          {
            type: StepTypeEnum.SMS,
            content: 'total digested: {{step.total_count}}',
          },
        ],
      });

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {
          exclude: false,
        },
      });
      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {},
      });

      await session.waitForJobCompletion(template._id);

      const messagesAfter = await messageRepository.find({
        _environmentId: session.environment._id,
        _subscriberId: subscriber._id,
        channel: StepTypeEnum.SMS,
      });

      expect(messagesAfter.length).to.equal(2);
      expect(messagesAfter && messagesAfter[0].content).to.include('total digested: 1');
      expect(messagesAfter && messagesAfter[1].content).to.include('total digested: 0');

      const executionDetails = await executionDetailsRepository.find({
        _environmentId: session.environment._id,
        _notificationTemplateId: template?._id,
        channel: StepTypeEnum.DIGEST,
        detail: DetailEnum.FILTER_STEPS,
      });

      expect(executionDetails.length).to.equal(1);
    });

    it('should not filter delay step', async function () {
      const firstStepUuid = uuid();
      template = await session.createTemplate({
        steps: [
          {
            type: StepTypeEnum.EMAIL,
            name: 'Message Name',
            subject: 'Test email subject',
            content: [{ type: EmailBlockTypeEnum.TEXT, content: 'This is a sample text block' }],
            uuid: firstStepUuid,
          },
          {
            type: StepTypeEnum.DELAY,
            content: '',
            metadata: {
              unit: DigestUnitEnum.SECONDS,
              amount: 2,
              type: DelayTypeEnum.REGULAR,
            },
            filters: [
              {
                isNegated: false,
                type: 'GROUP',
                value: FieldLogicalOperatorEnum.AND,
                children: [
                  {
                    on: FilterPartTypeEnum.PAYLOAD,
                    operator: FieldOperatorEnum.IS_DEFINED,
                    field: 'exclude',
                    value: '',
                  },
                ],
              },
            ],
          },
          {
            type: StepTypeEnum.EMAIL,
            name: 'Message Name',
            subject: 'Test email subject',
            content: [{ type: EmailBlockTypeEnum.TEXT, content: 'This is a sample text block' }],
          },
        ],
      });

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {
          customVar: 'Testing of User Name',
          exclude: false,
        },
      });

      await session.waitForJobCompletion(template._id);

      const messagesAfter = await messageRepository.find({
        _environmentId: session.environment._id,
        _subscriberId: subscriber._id,
        channel: StepTypeEnum.EMAIL,
      });

      expect(messagesAfter.length).to.equal(2);

      const executionDetails = await executionDetailsRepository.find({
        _environmentId: session.environment._id,
        _notificationTemplateId: template?._id,
        channel: StepTypeEnum.DELAY,
        detail: DetailEnum.FILTER_STEPS,
      });

      expect(executionDetails.length).to.equal(0);
    });

    it('should use conditions to select integration', async function () {
      const payload = {
        providerId: EmailProviderIdEnum.Mailgun,
        channel: 'email',
        credentials: { apiKey: '123', secretKey: 'abc' },
        _environmentId: session.environment._id,
        conditions: [
          {
            children: [{ field: 'identifier', value: 'test', operator: FieldOperatorEnum.EQUAL, on: 'tenant' }],
          },
        ],
        active: true,
        check: false,
      };

      await session.testAgent.post('/v1/integrations').send(payload);

      template = await createTemplate(session, ChannelTypeEnum.EMAIL);

      await createTenant({ session, identifier: 'test', name: 'test' });

      await sendTrigger(template, subscriber.subscriberId, {}, {}, 'test');

      await session.waitForJobCompletion(template._id);

      const createdSubscriber = await subscriberRepository.findBySubscriberId(
        session.environment._id,
        subscriber.subscriberId
      );

      const message = await messageRepository.findOne({
        _environmentId: session.environment._id,
        _subscriberId: createdSubscriber?._id,
        channel: ChannelTypeEnum.EMAIL,
      });

      expect(message?.providerId).to.equal(payload.providerId);
    });

    it('should use or conditions to select integration', async function () {
      const payload = {
        providerId: EmailProviderIdEnum.Mailgun,
        channel: 'email',
        credentials: { apiKey: '123', secretKey: 'abc' },
        _environmentId: session.environment._id,
        conditions: [
          {
            value: FieldLogicalOperatorEnum.OR,
            children: [
              { field: 'identifier', value: 'test3', operator: FieldOperatorEnum.EQUAL, on: 'tenant' },
              { field: 'identifier', value: 'test2', operator: FieldOperatorEnum.EQUAL, on: 'tenant' },
            ],
          },
        ],
        active: true,
        check: false,
      };

      await session.testAgent.post('/v1/integrations').send(payload);

      template = await createTemplate(session, ChannelTypeEnum.EMAIL);

      await createTenant({ session, identifier: 'test3', name: 'test3' });
      await createTenant({ session, identifier: 'test2', name: 'test2' });

      await sendTrigger(template, subscriber.subscriberId, {}, {}, 'test3');

      await session.waitForJobCompletion(template._id);

      const createdSubscriber = await subscriberRepository.findBySubscriberId(
        session.environment._id,
        subscriber.subscriberId
      );

      const firstMessage = await messageRepository.findOne({
        _environmentId: session.environment._id,
        _subscriberId: createdSubscriber?._id,
        channel: ChannelTypeEnum.EMAIL,
      });

      expect(firstMessage?.providerId).to.equal(payload.providerId);

      await sendTrigger(template, subscriber.subscriberId, {}, {}, 'test2');

      await session.waitForJobCompletion(template._id);

      const secondMessage = await messageRepository.findOne({
        _environmentId: session.environment._id,
        _subscriberId: createdSubscriber?._id,
        channel: ChannelTypeEnum.EMAIL,
        _id: {
          $ne: firstMessage?._id,
        },
      });

      expect(secondMessage?.providerId).to.equal(payload.providerId);
      expect(firstMessage?._id).to.not.equal(secondMessage?._id);
    });

    it('should return correct status when using a non existing tenant', async function () {
      const payload = {
        providerId: EmailProviderIdEnum.Mailgun,
        channel: 'email',
        credentials: { apiKey: '123', secretKey: 'abc' },
        _environmentId: session.environment._id,
        conditions: [
          {
            children: [{ field: 'identifier', value: 'test1', operator: FieldOperatorEnum.EQUAL, on: 'tenant' }],
          },
        ],
        active: true,
        check: false,
      };

      await session.testAgent.post('/v1/integrations').send(payload);

      template = await createTemplate(session, ChannelTypeEnum.EMAIL);

      const result = await sendTrigger(template, subscriber.subscriberId, {}, {}, 'test1');

      expect(result.status).to.equal('no_tenant_found');
    });

    it('should trigger an event successfully', async function () {
      const response = await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {
          firstName: 'Testing of User Name',
          urlVariable: '/test/url/path',
        },
      });

      const body = response.result;

      expect(body).to.be.ok;
      expect(body.status).to.equal('processed');
      expect(body.acknowledged).to.equal(true);
    });

    it('should store jobs & message provider id successfully', async function () {
      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
      });

      await session.waitForJobCompletion(template._id);

      const message = await messageRepository.find({
        _environmentId: session.environment._id,
        _templateId: template._id,
        _subscriberId: subscriber._id,
      });

      const inAppMessage = message.find((msg) => msg.channel === ChannelTypeEnum.IN_APP);
      const emailMessage = message.find((msg) => msg.channel === ChannelTypeEnum.EMAIL);

      expect(inAppMessage?.providerId).to.equal(InAppProviderIdEnum.Novu);
      expect(emailMessage?.providerId).to.equal(EmailProviderIdEnum.SendGrid);

      const inAppJob = await jobRepository.findOne({
        _id: inAppMessage?._jobId,
        _environmentId: session.environment._id,
      });
      const emailJob = await jobRepository.findOne({
        _id: emailMessage?._jobId,
        _environmentId: session.environment._id,
      });

      expect(inAppJob?.providerId).to.equal(InAppProviderIdEnum.Novu);
      expect(emailJob?.providerId).to.equal(EmailProviderIdEnum.SendGrid);
    });

    it('should create a subscriber based on event', async function () {
      const subscriberId = SubscriberRepository.createObjectId();
      const payload: SubscriberPayloadDto = {
        subscriberId,
        firstName: 'Test Name',
        lastName: 'Last of name',
        email: 'test@email.novu',
        locale: 'en',
        data: { custom1: 'custom value1', custom2: 'custom value2' },
      };
      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [payload],
        payload: {
          urlVar: '/test/url/path',
        },
      });

      await session.waitForJobCompletion();
      const envId = session.environment._id;
      const createdSubscriber = await subscriberRepository.findBySubscriberId(envId, subscriberId);

      expect(createdSubscriber?.subscriberId).to.equal(subscriberId);
      expect(createdSubscriber?.firstName).to.equal(payload.firstName);
      expect(createdSubscriber?.lastName).to.equal(payload.lastName);
      expect(createdSubscriber?.email).to.equal(payload.email);
      expect(createdSubscriber?.locale).to.equal(payload.locale);
      expect(createdSubscriber?.data).to.deep.equal(payload.data);
    });

    it('should update a subscribers email if one dont exists', async function () {
      const subscriberId = SubscriberRepository.createObjectId();
      const payload = {
        subscriberId,
        firstName: 'Test Name',
        lastName: 'Last of name',
        email: undefined,
        locale: 'en',
      };

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [
          {
            ...payload,
          },
        ],
        payload: {
          urlVar: '/test/url/path',
        },
      });

      await session.waitForJobCompletion();
      const createdSubscriber = await subscriberRepository.findBySubscriberId(session.environment._id, subscriberId);

      expect(createdSubscriber?.subscriberId).to.equal(subscriberId);
      expect(createdSubscriber?.firstName).to.equal(payload.firstName);
      expect(createdSubscriber?.lastName).to.equal(payload.lastName);
      expect(createdSubscriber?.email).to.equal(payload.email);
      expect(createdSubscriber?.locale).to.equal(payload.locale);

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [
          {
            ...payload,
            email: 'hello@world.com',
          },
        ],
        payload: {
          urlVar: '/test/url/path',
        },
      });

      await session.waitForJobCompletion();

      const updatedSubscriber = await subscriberRepository.findBySubscriberId(session.environment._id, subscriberId);

      expect(updatedSubscriber?.subscriberId).to.equal(subscriberId);
      expect(updatedSubscriber?.firstName).to.equal(payload.firstName);
      expect(updatedSubscriber?.lastName).to.equal(payload.lastName);
      expect(updatedSubscriber?.email).to.equal('hello@world.com');
      expect(updatedSubscriber?.locale).to.equal(payload.locale);
    });

    describe('Subscriber channels', function () {
      it('should set a new subscriber with channels array', async function () {
        const subscriberId = SubscriberRepository.createObjectId();
        const payload: SubscriberPayloadDto = {
          subscriberId,
          firstName: 'Test Name',
          lastName: 'Last of name',
          locale: 'en',
          channels: [
            {
              providerId: ChatProviderIdEnum.Slack,
              credentials: {
                webhookUrl: 'https://slack.com/webhook/test',
                deviceTokens: ['1', '2'],
              },
            },
          ],
        };

        await novuClient.trigger({
          workflowId: template.triggers[0].identifier,
          to: [payload],
          payload: {
            urlVar: '/test/url/path',
          },
        });

        await session.waitForJobCompletion();

        const createdSubscriber = await subscriberRepository.findBySubscriberId(session.environment._id, subscriberId);

        expect(createdSubscriber?.channels?.length).to.equal(1);
        if (createdSubscriber?.channels?.length !== 1) {
          throw new Error('need to have 1 channel');
        }
        expect(createdSubscriber?.channels[0]?.providerId).to.equal(ChatProviderIdEnum.Slack);
        const credentials = createdSubscriber?.channels[0]?.credentials;
        expect(credentials).to.be.ok;
        if (!credentials) {
          throw new Error('must have credentials');
        }
        expect(credentials.webhookUrl).to.equal('https://slack.com/webhook/test');
        const { deviceTokens } = credentials;
        expect(deviceTokens).to.be.ok;
        if (!deviceTokens) {
          throw new Error('');
        }
        expect(deviceTokens?.length).to.equal(2);
      });

      it('should update a subscribers channels array', async function () {
        const subscriberId = SubscriberRepository.createObjectId();
        const payload: SubscriberPayloadDto = {
          subscriberId,
          firstName: 'Test Name',
          lastName: 'Last of name',
          email: undefined,
          locale: 'en',
          channels: [
            {
              providerId: ChatProviderIdEnum.Slack,
              credentials: {
                webhookUrl: 'https://slack.com/webhook/test',
              },
            },
          ],
        };

        await novuClient.trigger({
          workflowId: template.triggers[0].identifier,
          to: [
            {
              ...payload,
            },
          ],
          payload: {
            urlVar: '/test/url/path',
          },
        });

        await session.waitForJobCompletion();
        const createdSubscriber = await subscriberRepository.findBySubscriberId(session.environment._id, subscriberId);

        expect(createdSubscriber?.subscriberId).to.equal(subscriberId);
        expect(createdSubscriber?.channels?.length).to.equal(1);

        await novuClient.trigger({
          workflowId: template.triggers[0].identifier,
          to: [
            {
              ...payload,
              channels: [
                {
                  providerId: ChatProviderIdEnum.Slack,
                  credentials: {
                    webhookUrl: 'https://slack.com/webhook/test2',
                  },
                },
              ],
            },
          ],
          payload: {
            urlVar: '/test/url/path',
          },
        });

        await session.waitForJobCompletion();

        const updatedSubscriber = await subscriberRepository.findBySubscriberId(session.environment._id, subscriberId);

        expect(updatedSubscriber?.channels?.length).to.equal(1);
        if (!updatedSubscriber?.channels?.length) {
          throw new Error('Channels must be an array');
        }
        expect(updatedSubscriber?.channels[0]?.providerId).to.equal(ChatProviderIdEnum.Slack);
        expect(updatedSubscriber?.channels[0]?.credentials?.webhookUrl).to.equal('https://slack.com/webhook/test2');
      });
    });

    it('should not unset a subscriber email', async function () {
      const subscriberId = SubscriberRepository.createObjectId();
      const payload = {
        subscriberId,
        firstName: 'Test Name',
        lastName: 'Last of name',
        email: 'hello@world.com',
        locale: 'en',
      };

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [
          {
            ...payload,
          },
        ],
        payload: {
          urlVar: '/test/url/path',
        },
      });

      await session.waitForJobCompletion();
      const createdSubscriber = await subscriberRepository.findBySubscriberId(session.environment._id, subscriberId);

      expect(createdSubscriber?.subscriberId).to.equal(subscriberId);
      expect(createdSubscriber?.firstName).to.equal(payload.firstName);
      expect(createdSubscriber?.lastName).to.equal(payload.lastName);
      expect(createdSubscriber?.email).to.equal(payload.email);
      expect(createdSubscriber?.locale).to.equal(payload.locale);

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [
          {
            ...payload,
            email: undefined,
          },
        ],
        payload: {
          urlVar: '/test/url/path',
        },
      });

      await session.waitForJobCompletion();

      const updatedSubscriber = await subscriberRepository.findBySubscriberId(session.environment._id, subscriberId);

      expect(updatedSubscriber?.subscriberId).to.equal(subscriberId);
      expect(updatedSubscriber?.firstName).to.equal(payload.firstName);
      expect(updatedSubscriber?.lastName).to.equal(payload.lastName);
      expect(updatedSubscriber?.email).to.equal('hello@world.com');
      expect(updatedSubscriber?.locale).to.equal(payload.locale);
    });

    it('should override subscriber email based on event data', async function () {
      const subscriberId = SubscriberRepository.createObjectId();
      const transactionId = SubscriberRepository.createObjectId();

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        transactionId,
        to: [
          { subscriberId: subscriber.subscriberId, email: 'gg@ff.com' },
          { subscriberId, email: 'gg@ff.com' },
        ],
        overrides: {
          email: {
            toRecipient: 'new-test-email@gmail.com',
          },
        },
      });

      await session.waitForJobCompletion();

      const messages = await messageRepository.findBySubscriberChannel(
        session.environment._id,
        subscriber._id,
        ChannelTypeEnum.EMAIL
      );
      const createdSubscriber = await subscriberRepository.findBySubscriberId(session.environment._id, subscriberId);

      await messageRepository.findBySubscriberChannel(
        session.environment._id,
        createdSubscriber?._id as string,
        ChannelTypeEnum.EMAIL
      );

      expect(subscriber.email).to.not.equal('new-test-email@gmail.com');
      expect(messages[0].email).to.equal('new-test-email@gmail.com');
    });

    it('should generate message and notification based on event', async function () {
      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [
          {
            subscriberId: subscriber.subscriberId,
          },
        ],
        payload: {
          firstName: 'Testing of User Name',
          urlVar: '/test/url/path',
          attachments: [
            {
              name: 'text1.txt',
              file: 'hello world!',
            },
            {
              name: 'text2.txt',
              file: Buffer.from('hello world!', 'utf-8'),
            },
          ],
        },
      });

      await session.waitForJobCompletion(template._id);

      const notifications = await notificationRepository.findBySubscriberId(session.environment._id, subscriber._id);

      expect(notifications.length).to.equal(1);

      const notification = notifications[0];

      expect(notification._organizationId).to.equal(session.organization._id);
      expect(notification._templateId).to.equal(template._id);

      const messages = await messageRepository.findBySubscriberChannel(
        session.environment._id,
        subscriber._id,
        ChannelTypeEnum.IN_APP
      );

      expect(messages.length).to.equal(1);
      const message = messages[0];

      expect(message.channel).to.equal(ChannelTypeEnum.IN_APP);
      expect(message.content as string).to.equal('Test content for <b>Testing of User Name</b>');
      expect(message.seen).to.equal(false);
      expect(message.cta.data.url).to.equal('/cypress/test-shell/example/test?test-param=true');
      expect(message.lastSeenDate).to.be.not.ok;
      expect(message.payload.firstName).to.equal('Testing of User Name');
      expect(message.payload.urlVar).to.equal('/test/url/path');
      expect(message.payload.attachments).to.be.not.ok;

      const emails = await messageRepository.findBySubscriberChannel(
        session.environment._id,
        subscriber._id,
        ChannelTypeEnum.EMAIL
      );

      expect(emails.length).to.equal(1);
      const email = emails[0];

      expect(email.channel).to.equal(ChannelTypeEnum.EMAIL);
    });

    it('should correctly set expiration date (TTL) for notification and messages', async function () {
      const templateName = template.triggers[0].identifier;

      const response = await novuClient.trigger({
        workflowId: templateName,
        to: [
          {
            subscriberId: subscriber.subscriberId,
          },
        ],
        payload: {
          firstName: 'Testing of User Name',
          urlVar: '/test/url/path',
        },
      });
      const body = response.result;
      expect(body).to.have.all.keys('acknowledged', 'status', 'transactionId');
      expect(body.acknowledged).to.equal(true);
      expect(body.status).to.equal('processed');
      expect(body.transactionId).to.be.a.string;

      await session.waitForJobCompletion(template._id);

      const jobs = await jobRepository.find({
        _templateId: template._id,
        _environmentId: session.environment._id,
      });
      expect(jobs.length).to.equal(3);

      const notifications = await notificationRepository.findBySubscriberId(session.environment._id, subscriber._id);

      expect(notifications.length).to.equal(1);

      const messages = await messageRepository.findBySubscriberChannel(
        session.environment._id,
        subscriber._id,
        ChannelTypeEnum.IN_APP
      );

      expect(messages.length).to.equal(1);
      const message = messages[0];

      let createdAt = new Date(message?.createdAt as string);

      const emails = await messageRepository.findBySubscriberChannel(
        session.environment._id,
        subscriber._id,
        ChannelTypeEnum.EMAIL
      );

      expect(emails.length).to.equal(1);
      const email = emails[0];

      createdAt = new Date(email?.createdAt as string);
    });

    it('should trigger SMS notification', async function () {
      template = await session.createTemplate({
        steps: [
          {
            type: StepTypeEnum.SMS,
            content: 'Hello world {{customVar}}' as string,
          },
        ],
      });

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {
          customVar: 'Testing of User Name',
        },
      });

      await session.waitForJobCompletion(template._id);

      const message = await messageRepository._model.findOne({
        _environmentId: session.environment._id,
        _templateId: template._id,
        _subscriberId: subscriber._id,
        channel: ChannelTypeEnum.SMS,
      });

      expect(message!.phone).to.equal(subscriber.phone);
    });

    it('should trigger SMS notification for all subscribers', async function () {
      const subscriberId = SubscriberRepository.createObjectId();
      template = await session.createTemplate({
        steps: [
          {
            type: StepTypeEnum.SMS,
            content: 'Welcome to {{organizationName}}' as string,
          },
        ],
      });

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [{ subscriberId: subscriber.subscriberId }, { subscriberId, phone: '+972541111111' }],
        payload: {
          organizationName: 'Testing of Organization Name',
        },
      });

      await session.waitForJobCompletion(template._id);

      const message = await messageRepository._model.findOne({
        _environmentId: session.environment._id,
        _templateId: template._id,
        _subscriberId: subscriber._id,
        channel: ChannelTypeEnum.SMS,
      });

      const createdSubscriber = await subscriberRepository.findBySubscriberId(session.environment._id, subscriberId);

      const message2 = await messageRepository._model.findOne({
        _environmentId: session.environment._id,
        _templateId: template._id,
        _subscriberId: createdSubscriber?._id,
        channel: ChannelTypeEnum.SMS,
      });

      expect(message2!.phone).to.equal('+972541111111');
    });

    it('should trigger an sms error', async function () {
      template = await session.createTemplate({
        steps: [
          {
            type: StepTypeEnum.SMS,
            content: 'Hello world {{firstName}}' as string,
          },
        ],
      });
      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {
          phone: '+972541111111',
          firstName: 'Testing of User Name',
        },
      });

      await session.waitForJobCompletion(template._id);

      const message = await messageRepository._model.findOne({
        _environmentId: session.environment._id,
        _templateId: template._id,
        _subscriberId: subscriber._id,
      });

      expect(message!.status).to.equal('error');
      expect(message!.errorText).to.contains('Currently 3rd-party packages test are not support on test env');
    });

    it('should trigger in-app notification', async function () {
      const channelType = ChannelTypeEnum.IN_APP;

      template = await createTemplate(session, channelType);

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [
          { subscriberId: 'no_type_123', lastName: 'smith_no_type', email: 'test@email.novu' },
          {
            type: 'Subscriber',
            subscriberId: 'with_type_123',
            lastName: 'smith_with_type',
            email: 'test@email.novu',
          },
        ],
        payload: {
          organizationName: 'Umbrella Corp',
          compiledVariable: 'test-env',
        },
      });

      await session.waitForJobCompletion(template._id);

      let createdSubscriber = await subscriberRepository.findBySubscriberId(session.environment._id, 'no_type_123');
      let message = await messageRepository.findOne({
        _environmentId: session.environment._id,
        _subscriberId: createdSubscriber?._id,
        channel: channelType,
      });
      expect(message!.content).to.equal('Hello smith_no_type, Welcome to Umbrella Corp');

      createdSubscriber = await subscriberRepository.findBySubscriberId(session.environment._id, 'with_type_123');
      message = await messageRepository.findOne({
        _environmentId: session.environment._id,
        _subscriberId: createdSubscriber?._id,
        channel: channelType,
      });
      expect(message!.content).to.equal('Hello smith_with_type, Welcome to Umbrella Corp');
    });

    it('should trigger SMS notification with subscriber data', async function () {
      const newSubscriberIdInAppNotification = SubscriberRepository.createObjectId();
      const channelType = ChannelTypeEnum.SMS;

      template = await createTemplate(session, channelType);

      await sendTrigger(template, newSubscriberIdInAppNotification);

      await session.waitForJobCompletion(template._id);

      const createdSubscriber = await subscriberRepository.findBySubscriberId(
        session.environment._id,
        newSubscriberIdInAppNotification
      );

      const message = await messageRepository.findOne({
        _environmentId: session.environment._id,
        _subscriberId: createdSubscriber?._id,
        channel: channelType,
      });

      expect(message!.content).to.equal('Hello Smith, Welcome to Umbrella Corp');
    });

    it('should trigger E-Mail notification with subscriber data', async function () {
      const newSubscriberIdInAppNotification = SubscriberRepository.createObjectId();
      const channelType = ChannelTypeEnum.EMAIL;

      template = await createTemplate(session, channelType);

      template = await session.createTemplate({
        steps: [
          {
            name: 'Message Name',
            subject: 'Test email {{nested.subject}}',
            type: StepTypeEnum.EMAIL,
            content: [
              {
                type: EmailBlockTypeEnum.TEXT,
                content: 'Hello {{subscriber.lastName}}, Welcome to {{organizationName}}' as string,
              },
            ],
          },
        ],
      });

      await sendTrigger(template, newSubscriberIdInAppNotification, {
        nested: {
          subject: 'a subject nested',
        },
      });

      await session.waitForJobCompletion(template._id);

      const createdSubscriber = await subscriberRepository.findBySubscriberId(
        session.environment._id,
        newSubscriberIdInAppNotification
      );

      const message = await messageRepository.findOne({
        _environmentId: session.environment._id,
        _subscriberId: createdSubscriber?._id,
        channel: channelType,
      });

      const block = message!.content[0] as IEmailBlock;

      expect(block.content).to.equal('Hello Smith, Welcome to Umbrella Corp');
      expect(message!.subject).to.equal('Test email a subject nested');
    });

    it('should trigger E-Mail notification with actor data', async function () {
      const newSubscriberId = SubscriberRepository.createObjectId();
      const channelType = ChannelTypeEnum.EMAIL;
      const actorSubscriber = await subscriberService.createSubscriber({ firstName: 'Actor' });

      template = await session.createTemplate({
        steps: [
          {
            name: 'Message Name',
            subject: 'Test email',
            type: StepTypeEnum.EMAIL,
            content: [
              {
                type: EmailBlockTypeEnum.TEXT,
                content: 'Hello {{actor.firstName}}, Welcome to {{organizationName}}' as string,
              },
            ],
          },
        ],
      });

      await sendTrigger(template, newSubscriberId, {}, {}, '', actorSubscriber.subscriberId);

      await session.waitForJobCompletion(template._id);

      const createdSubscriber = await subscriberRepository.findBySubscriberId(session.environment._id, newSubscriberId);

      const message = await messageRepository.findOne({
        _environmentId: session.environment._id,
        _subscriberId: createdSubscriber?._id,
        channel: channelType,
      });

      const block = message!.content[0] as IEmailBlock;

      expect(block.content).to.equal('Hello Actor, Welcome to Umbrella Corp');
    });

    it('should not trigger notification with subscriber data if integration is inactive', async function () {
      const newSubscriberIdInAppNotification = SubscriberRepository.createObjectId();
      const channelType = ChannelTypeEnum.SMS;

      const integration = await integrationRepository.findOne({
        _environmentId: session.environment._id,
        _organizationId: session.organization._id,
        providerId: SmsProviderIdEnum.Twilio,
      });

      await integrationRepository.update(
        { _environmentId: session.environment._id, _id: integration!._id },
        { active: false }
      );

      template = await createTemplate(session, channelType);

      template = await session.createTemplate({
        steps: [
          {
            name: 'Message Name',
            subject: 'Test sms {{nested.subject}}',
            type: StepTypeEnum.EMAIL,
            content: [
              {
                type: EmailBlockTypeEnum.TEXT,
                content: 'Hello {{subscriber.lastName}}, Welcome to {{organizationName}}' as string,
              },
            ],
          },
        ],
      });

      await sendTrigger(template, newSubscriberIdInAppNotification, {
        nested: {
          subject: 'a subject nested',
        },
      });

      await session.waitForJobCompletion(template._id);

      const createdSubscriber = await subscriberRepository.findBySubscriberId(
        session.environment._id,
        newSubscriberIdInAppNotification
      );

      const message = await messageRepository.findOne({
        _environmentId: session.environment._id,
        _subscriberId: createdSubscriber?._id,
        channel: channelType,
      });

      expect(message).to.be.null;
    });

    it('should use Novu integration for new orgs', async function () {
      process.env.NOVU_EMAIL_INTEGRATION_API_KEY = 'true';

      const existingIntegrations = await integrationRepository.find({
        _organizationId: session.organization._id,
        _environmentId: session.environment._id,
        active: true,
      });

      const integrationIdsToDelete = existingIntegrations.flatMap((integration) =>
        integration._environmentId === session.environment._id ? [integration._id] : []
      );

      const deletedIntegrations = await integrationRepository.deleteMany({
        _id: { $in: integrationIdsToDelete },
        _organizationId: session.organization._id,
        _environmentId: session.environment._id,
      });

      expect(deletedIntegrations.modifiedCount).to.eql(integrationIdsToDelete.length);

      await integrationRepository.update(
        {
          _organizationId: session.organization._id,
          _environmentId: session.environment._id,
          active: false,
        },
        {
          $set: {
            active: true,
            primary: true,
            priority: 1,
          },
        }
      );

      const newSubscriberIdInAppNotification = SubscriberRepository.createObjectId();
      const channelType = ChannelTypeEnum.EMAIL;

      template = await createTemplate(session, channelType);

      template = await session.createTemplate({
        steps: [
          {
            name: 'Message Name',
            subject: 'Test sms {{nested.subject}}',
            type: StepTypeEnum.EMAIL,
            content: [
              {
                type: EmailBlockTypeEnum.TEXT,
                content: 'Hello {{subscriber.lastName}}, Welcome to {{organizationName}}' as string,
              },
            ],
          },
        ],
      });

      await sendTrigger(template, newSubscriberIdInAppNotification, {
        nested: {
          subject: 'a subject nested',
        },
      });

      await session.waitForJobCompletion(template._id);

      const createdSubscriber = await subscriberRepository.findBySubscriberId(
        session.environment._id,
        newSubscriberIdInAppNotification
      );

      const message = await messageRepository.findOne({
        _environmentId: session.environment._id,
        _subscriberId: createdSubscriber?._id,
        channel: channelType,
      });

      expect(message!.providerId).to.equal(EmailProviderIdEnum.Novu);
    });

    it('should trigger message with active integration', async function () {
      const newSubscriberIdInAppNotification = SubscriberRepository.createObjectId();
      const channelType = ChannelTypeEnum.EMAIL;

      template = await session.createTemplate({
        steps: [
          {
            name: 'Message Name',
            subject: 'Test email {{nested.subject}}',
            type: StepTypeEnum.EMAIL,
            content: [],
          },
        ],
      });

      await sendTrigger(template, newSubscriberIdInAppNotification, {
        nested: {
          subject: 'a subject nested',
        },
      });

      await session.waitForJobCompletion(template._id);

      const createdSubscriber = await subscriberRepository.findBySubscriberId(
        session.environment._id,
        newSubscriberIdInAppNotification
      );

      let messages = await messageRepository.find({
        _environmentId: session.environment._id,
        _subscriberId: createdSubscriber?._id,
        channel: channelType,
      });

      expect(messages.length).to.be.equal(1);
      expect(messages[0].providerId).to.be.equal(EmailProviderIdEnum.SendGrid);

      const payload = {
        providerId: EmailProviderIdEnum.Mailgun,
        channel: 'email',
        credentials: { apiKey: '123', secretKey: 'abc' },
        active: true,
        check: false,
      };

      const {
        body: { data },
      } = await session.testAgent.post('/v1/integrations').send(payload);
      await session.testAgent.post(`/v1/integrations/${data._id}/set-primary`).send({});

      await sendTrigger(template, newSubscriberIdInAppNotification, {
        nested: {
          subject: 'a subject nested',
        },
      });

      await session.waitForJobCompletion(template._id);

      messages = await messageRepository.find(
        {
          _environmentId: session.environment._id,
          _subscriberId: createdSubscriber?._id,
          channel: channelType,
        },
        '',
        { sort: { createdAt: -1 } }
      );

      expect(messages.length).to.be.equal(2);
      expect(messages[0].providerId).to.be.equal(EmailProviderIdEnum.Mailgun);
    });

    it('should fail to trigger with missing variables', async function () {
      template = await session.createTemplate({
        steps: [
          {
            name: 'Message Name',
            subject: 'Test email {{nested.subject}}',
            type: StepTypeEnum.EMAIL,
            variables: [
              { name: 'myUser.lastName', required: true, type: TemplateVariableTypeEnum.STRING },
              { name: 'myUser.array', required: true, type: TemplateVariableTypeEnum.ARRAY },
              { name: 'myUser.bool', required: true, type: TemplateVariableTypeEnum.BOOLEAN },
            ],
            content: [
              {
                type: EmailBlockTypeEnum.TEXT,
                content: 'Hello {{myUser.lastName}}, Welcome to {{organizationName}}' as string,
              },
            ],
          },
        ],
      });

      let response = await session.testAgent
        .post('/v1/events/trigger')
        .send({
          name: template.triggers[0].identifier,
          to: [subscriber.subscriberId],
          payload: {},
        })
        .expect(400);

      expect(JSON.stringify(response.body)).to.include(
        'payload is missing required key(s) and type(s): myUser.lastName (Value), myUser.array (Array), myUser.bool (Boolean)'
      );

      response = await session.testAgent
        .post('/v1/events/trigger')
        .send({
          name: template.triggers[0].identifier,
          to: [subscriber.subscriberId],
          payload: {
            myUser: {
              lastName: true,
              array: 'John Doe',
              bool: 0,
            },
          },
        })
        .expect(400);

      expect(JSON.stringify(response.body)).to.include(
        'payload is missing required key(s) and type(s): myUser.lastName (Value), myUser.array (Array), myUser.bool (Boolean)'
      );

      response = await session.testAgent
        .post('/v1/events/trigger')
        .send({
          name: template.triggers[0].identifier,
          to: [subscriber.subscriberId],
          payload: {
            myUser: {
              lastName: '',
              array: [],
              bool: true,
            },
          },
        })
        .expect(201);
    });

    it('should fill trigger payload with default variables', async function () {
      const newSubscriberIdInAppNotification = SubscriberRepository.createObjectId();
      const channelType = ChannelTypeEnum.EMAIL;

      template = await session.createTemplate({
        steps: [
          {
            name: 'Message Name',
            subject: 'Test email {{nested.subject}}',
            type: StepTypeEnum.EMAIL,
            variables: [
              {
                name: 'myUser.lastName',
                required: false,
                type: TemplateVariableTypeEnum.STRING,
                defaultValue: 'John Doe',
              },
              {
                name: 'organizationName',
                required: false,
                type: TemplateVariableTypeEnum.STRING,
                defaultValue: 'Novu Corp',
              },
            ],
            content: [
              {
                type: EmailBlockTypeEnum.TEXT,
                content: 'Hello {{myUser.lastName}}, Welcome to {{organizationName}}' as string,
              },
            ],
          },
        ],
      });

      await session.testAgent
        .post('/v1/events/trigger')
        .send({
          name: template.triggers[0].identifier,
          to: newSubscriberIdInAppNotification,
          payload: {
            organizationName: 'Umbrella Corp',
          },
        })
        .expect(201);

      await session.waitForJobCompletion(template._id);

      const createdSubscriber = await subscriberRepository.findBySubscriberId(
        session.environment._id,
        newSubscriberIdInAppNotification
      );

      const message = await messageRepository.findOne({
        _environmentId: session.environment._id,
        _subscriberId: createdSubscriber?._id,
        channel: channelType,
      });

      const block = message!.content[0] as IEmailBlock;

      expect(block.content).to.equal('Hello John Doe, Welcome to Umbrella Corp');
    });

    it('should throw an error when workflow identifier provided is not in the database', async () => {
      const response = await session.testAgent
        .post('/v1/events/trigger')
        .send({
          name: 'non-existent-template-identifier',
          to: [subscriber.subscriberId],
          payload: {
            myUser: {
              lastName: 'Test',
            },
          },
        })
        .expect(422);

      const { body } = response;

      expect(body.statusCode).to.equal(422);
      expect(body.message).to.equal('workflow_not_found');
      expect(body.error).to.equal('Unprocessable Entity');
    });

    it('should handle empty workflow scenario', async function () {
      template = await session.createTemplate({
        steps: [],
      });

      const response = await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {
          myUser: {
            lastName: 'Test',
          },
        },
      });

      const { status, acknowledged } = response.result;
      expect(status).to.equal('no_workflow_steps_defined');
      expect(acknowledged).to.equal(true);
    });

    it('should trigger with given required variables', async function () {
      template = await session.createTemplate({
        steps: [
          {
            name: 'Message Name',
            subject: 'Test email {{nested.subject}}',
            type: StepTypeEnum.EMAIL,
            variables: [{ name: 'myUser.lastName', required: true, type: TemplateVariableTypeEnum.STRING }],
            content: [
              {
                type: EmailBlockTypeEnum.TEXT,
                content: 'Hello {{myUser.lastName}}, Welcome to {{organizationName}}' as string,
              },
            ],
          },
        ],
      });

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {
          myUser: {
            lastName: 'Test',
          },
        },
      });
    });

    it('should broadcast trigger to all subscribers', async () => {
      subscriberService = new SubscribersService(session.organization._id, session.environment._id);
      await subscriberService.createSubscriber();
      await subscriberService.createSubscriber();

      const channelType = ChannelTypeEnum.EMAIL;

      template = await createTemplate(session, channelType);

      template = await session.createTemplate({
        steps: [
          {
            name: 'Message Name',
            subject: 'Test email subject',
            type: StepTypeEnum.EMAIL,
            content: [
              {
                type: EmailBlockTypeEnum.TEXT,
                content: 'Hello {{subscriber.lastName}}, Welcome to {{organizationName}}' as string,
              },
            ],
          },
        ],
      });

      await novuClient.triggerBroadcast({
        name: template.triggers[0].identifier,
        payload: {
          organizationName: 'Umbrella Corp',
        },
      });
      await session.waitForJobCompletion(template._id);
      const messages = await messageRepository.find({
        _environmentId: session.environment._id,
        channel: channelType,
      });

      expect(messages.length).to.equal(4);
      const isUnique = (value, index, self) => self.indexOf(value) === index;
      const subscriberIds = messages.map((message) => message._subscriberId).filter(isUnique);
      expect(subscriberIds.length).to.equal(4);
    });

    it('should not filter a message with correct payload', async function () {
      template = await session.createTemplate({
        steps: [
          {
            type: StepTypeEnum.EMAIL,
            subject: 'Password reset',
            content: [
              {
                type: EmailBlockTypeEnum.TEXT,
                content: 'This are the text contents of the template for {{firstName}}',
              },
              {
                type: EmailBlockTypeEnum.BUTTON,
                content: 'SIGN UP',
                url: 'https://url-of-app.com/{{urlVariable}}',
              },
            ],
            filters: [
              {
                isNegated: false,

                type: 'GROUP',

                value: FieldLogicalOperatorEnum.AND,

                children: [
                  {
                    field: 'run',
                    value: 'true',
                    operator: FieldOperatorEnum.EQUAL,
                    on: FilterPartTypeEnum.PAYLOAD,
                  },
                ],
              },
            ],
          },
          {
            type: StepTypeEnum.EMAIL,
            subject: 'Password reset',
            content: [
              {
                type: EmailBlockTypeEnum.TEXT,
                content: 'This are the text contents of the template for {{firstName}}',
              },
              {
                type: EmailBlockTypeEnum.BUTTON,
                content: 'SIGN UP',
                url: 'https://url-of-app.com/{{urlVariable}}',
              },
            ],
            filters: [
              {
                isNegated: false,

                type: 'GROUP',

                value: FieldLogicalOperatorEnum.AND,

                children: [
                  {
                    field: 'subscriberId',
                    value: subscriber.subscriberId,
                    operator: FieldOperatorEnum.NOT_EQUAL,
                    on: FilterPartTypeEnum.SUBSCRIBER,
                  },
                ],
              },
            ],
          },
        ],
      });

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {
          firstName: 'Testing of User Name',
          urlVariable: '/test/url/path',
          run: true,
        },
      });

      await session.waitForJobCompletion(template._id);

      const messages = await messageRepository.count({
        _environmentId: session.environment._id,
        _templateId: template._id,
      });

      expect(messages).to.equal(1);
    });

    it('should filter a message based on webhook filter', async function () {
      template = await session.createTemplate({
        steps: [
          {
            type: StepTypeEnum.EMAIL,
            subject: 'Password reset',
            content: [
              {
                type: EmailBlockTypeEnum.TEXT,
                content: 'This are the text contents of the template for {{firstName}}',
              },
              {
                type: EmailBlockTypeEnum.BUTTON,
                content: 'SIGN UP',
                url: 'https://url-of-app.com/{{urlVariable}}',
              },
            ],
            filters: [
              {
                isNegated: false,
                type: 'GROUP',
                value: FieldLogicalOperatorEnum.AND,
                children: [
                  {
                    field: 'isOnline',
                    value: 'true',
                    operator: FieldOperatorEnum.EQUAL,
                    on: FilterPartTypeEnum.WEBHOOK,
                    webhookUrl: 'www.user.com/webhook',
                  },
                ],
              },
            ],
          },
        ],
      });

      /*
       * let axiosPostStub = sinon.stub(axios, 'post').resolves(
       *   Promise.resolve({
       *     data: { isOnline: true },
       *   })
       * );
       */

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {},
      });

      await session.waitForJobCompletion(template._id);

      let messages = await messageRepository.count({
        _environmentId: session.environment._id,
        _templateId: template._id,
      });

      expect(messages).to.equal(1);

      /*
       * axiosPostStub.restore();
       * axiosPostStub = sinon.stub(axios, 'post').resolves(
       *   Promise.resolve({
       *     data: { isOnline: false },
       *   })
       * );
       */

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {},
      });

      await session.waitForJobCompletion(template._id);

      messages = await messageRepository.count({
        _environmentId: session.environment._id,
        _templateId: template._id,
      });

      expect(messages).to.equal(2);
    });

    it('should throw exception on webhook filter - demo unavailable server', async function () {
      template = await session.createTemplate({
        steps: [
          {
            type: StepTypeEnum.EMAIL,
            subject: 'Password reset',
            content: [
              {
                type: EmailBlockTypeEnum.TEXT,
                content: 'This are the text contents of the template for {{firstName}}',
              },
              {
                type: EmailBlockTypeEnum.BUTTON,
                content: 'SIGN UP',
                url: 'https://url-of-app.com/{{urlVariable}}',
              },
            ],
            filters: [
              {
                isNegated: false,
                type: 'GROUP',
                value: FieldLogicalOperatorEnum.AND,
                children: [
                  {
                    field: 'isOnline',
                    value: 'true',
                    operator: FieldOperatorEnum.EQUAL,
                    on: FilterPartTypeEnum.WEBHOOK,
                    webhookUrl: 'www.user.com/webhook',
                  },
                ],
              },
            ],
          },
        ],
      });

      // const axiosPostStub = sinon.stub(axios, 'post').throws(new Error('Users remote error')));

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {},
      });

      await session.waitForJobCompletion(template._id);

      const messages = await messageRepository.count({
        _environmentId: session.environment._id,
        _templateId: template._id,
      });

      expect(messages).to.equal(1);
    });

    it('should backoff on exception while webhook filter (original request + 2 retries)', async function () {
      template = await session.createTemplate({
        steps: [
          {
            type: StepTypeEnum.EMAIL,
            subject: 'Password reset',
            content: [
              {
                type: EmailBlockTypeEnum.TEXT,
                content: 'This are the text contents of the template for {{firstName}}',
              },
              {
                type: EmailBlockTypeEnum.BUTTON,
                content: 'SIGN UP',
                url: 'https://url-of-app.com/{{urlVariable}}',
              },
            ],
            filters: [
              {
                isNegated: false,
                type: 'GROUP',
                value: FieldLogicalOperatorEnum.AND,
                children: [
                  {
                    field: 'isOnline',
                    value: 'true',
                    operator: FieldOperatorEnum.EQUAL,
                    on: FilterPartTypeEnum.WEBHOOK,
                    webhookUrl: 'www.user.com/webhook',
                  },
                ],
              },
            ],
          },
        ],
      });

      // let axiosPostStub = sinon.stub(axios, 'post');

      /*
       * axiosPostStub
       *   .onCall(0)
       *   .throws(new Error('Users remote error'))
       *   .onCall(1)
       *   .resolves({
       *     data: { isOnline: true },
       *   });
       */

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {},
      });

      await session.waitForJobCompletion(template._id);

      let messages = await messageRepository.count({
        _environmentId: session.environment._id,
        _templateId: template._id,
      });

      expect(messages).to.equal(1);

      /*
       * axiosPostStub.restore();
       * axiosPostStub = sinon
       *   .stub(axios, 'post')
       *   .onCall(0)
       *   .throws(new Error('Users remote error'))
       *   .onCall(1)
       *   .throws(new Error('Users remote error'))
       *   .onCall(2)
       *   .throws(new Error('Users remote error'))
       *   .resolves(
       *     Promise.resolve({
       *       data: { isOnline: true },
       *     })
       *   );
       */

      await novuClient.trigger({
        workflowId: template.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {},
      });

      await session.waitForJobCompletion(template._id);

      messages = await messageRepository.count({
        _environmentId: session.environment._id,
        _templateId: template._id,
      });

      expect(messages).to.equal(2);
    });

    it('should choose variant by tenant data', async function () {
      const tenant = await tenantRepository.create({
        _organizationId: session.organization._id,
        _environmentId: session.environment._id,
        identifier: 'one_123',
        name: 'The one and only tenant',
        data: { value1: 'Best fighter', value2: 'Ever' },
      });

      const templateWithVariants = await session.createTemplate({
        name: 'test email template',
        description: 'This is a test description',
        steps: [
          {
            name: 'Root Message Name',
            subject: 'Root Test email subject',
            preheader: 'Root Test email preheader',
            content: [{ type: EmailBlockTypeEnum.TEXT, content: 'Root This is a sample text block' }],
            type: StepTypeEnum.EMAIL,
            filters: [],
            variants: [
              {
                name: 'Bad Variant Message Template',
                subject: 'Bad Variant subject',
                preheader: 'Bad Variant pre header',
                content: [{ type: EmailBlockTypeEnum.TEXT, content: 'This is a sample of Bad Variant text block' }],
                type: StepTypeEnum.EMAIL,
                active: true,
                filters: [
                  {
                    isNegated: false,
                    type: 'GROUP',
                    value: FieldLogicalOperatorEnum.AND,
                    children: [
                      {
                        on: FilterPartTypeEnum.TENANT,
                        field: 'name',
                        value: 'Titans',
                        operator: FieldOperatorEnum.EQUAL,
                      },
                    ],
                  },
                ],
              },
              {
                name: 'Better Variant Message Template',
                subject: 'Better Variant subject',
                preheader: 'Better Variant pre header',
                content: [{ type: EmailBlockTypeEnum.TEXT, content: 'This is a sample of Better Variant text block' }],
                type: StepTypeEnum.EMAIL,
                active: true,
                filters: [
                  {
                    isNegated: false,
                    type: 'GROUP',
                    value: FieldLogicalOperatorEnum.AND,
                    children: [
                      {
                        on: FilterPartTypeEnum.TENANT,
                        field: 'name',
                        value: 'The one and only tenant',
                        operator: FieldOperatorEnum.EQUAL,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      await novuClient.trigger({
        workflowId: templateWithVariants.triggers[0].identifier,
        to: [subscriber.subscriberId],
        payload: {},
        tenant: { identifier: tenant.identifier },
      });

      await session.waitForJobCompletion(templateWithVariants._id);

      const messages = await messageRepository.find({
        _environmentId: session.environment._id,
        _templateId: templateWithVariants._id,
      });

      expect(messages.length).to.equal(1);
      expect(messages[0].subject).to.equal('Better Variant subject');
    });

    describe('Post Mortem', function () {
      // Repeat the test 3 times

      it(`should not create multiple subscribers when multiple triggers are made        
         with the same not created subscribers `, async () => {
        // Access subscriberRepository and print database indexes
        console.log('Accessing subscriberRepository indexes...');
        const subscriberModel = subscriberRepository._model;
        subscriberModel.collection
          .getIndexes()
          .then((indexes) => {
            console.log('Subscriber Collection Indexes:');
            console.log(JSON.stringify(indexes, null, 2));
          })
          .catch((error) => {
            console.error('Error fetching indexes:', error);
          });
        template = await createSimpleWorkflow(session);
        for (let i = 0; i < 3; i += 1) {
          const subscriberId = `not-created-twice-subscriber${i}`;
          await Promise.all([
            simpleTrigger(novuClient, template, subscriberId),
            simpleTrigger(novuClient, template, subscriberId),
          ]);
          await session.waitForJobCompletion(template._id);

          const subscribers = await subscriberRepository.find({
            _environmentId: session.environment._id,
            subscriberId,
          });

          expect(subscribers.length).to.equal(1);
        }
      });
    });
    describe('filters logic', () => {
      beforeEach(async () => {
        subscriberService = new SubscribersService(session.organization._id, session.environment._id);
        subscriber = await subscriberService.createSubscriber();
      });

      it('should filter a message with variables', async function () {
        template = await session.createTemplate({
          steps: [
            {
              type: StepTypeEnum.EMAIL,
              subject: 'Password reset',
              content: [
                {
                  type: EmailBlockTypeEnum.TEXT,
                  content: 'This are the text contents of the template for {{firstName}}',
                },
                {
                  type: EmailBlockTypeEnum.BUTTON,
                  content: 'SIGN UP',
                  url: 'https://url-of-app.com/{{urlVariable}}',
                },
              ],
              filters: [
                {
                  isNegated: false,
                  type: 'GROUP',
                  value: FieldLogicalOperatorEnum.AND,
                  children: [
                    {
                      field: 'run',
                      value: '{{payload.var}}',
                      operator: FieldOperatorEnum.EQUAL,
                      on: FilterPartTypeEnum.PAYLOAD,
                    },
                  ],
                },
              ],
            },
            {
              type: StepTypeEnum.EMAIL,
              subject: 'Password reset',
              content: [
                {
                  type: EmailBlockTypeEnum.TEXT,
                  content: 'This are the text contents of the template for {{firstName}}',
                },
              ],
              filters: [
                {
                  isNegated: false,
                  type: 'GROUP',
                  value: FieldLogicalOperatorEnum.AND,
                  children: [
                    {
                      field: 'subscriberId',
                      value: subscriber.subscriberId,
                      operator: FieldOperatorEnum.NOT_EQUAL,
                      on: FilterPartTypeEnum.SUBSCRIBER,
                    },
                  ],
                },
              ],
            },
          ],
        });

        await novuClient.trigger({
          workflowId: template.triggers[0].identifier,
          to: [subscriber.subscriberId],
          payload: {
            firstName: 'Testing of User Name',
            urlVariable: '/test/url/path',
            run: true,
            var: true,
          },
        });

        await session.waitForJobCompletion(template._id);

        const messages = await messageRepository.count({
          _environmentId: session.environment._id,
          _templateId: template._id,
        });

        expect(messages).to.equal(1);
      });

      it('should filter a message with value that includes variables and strings', async function () {
        const actorSubscriber = await subscriberService.createSubscriber({
          firstName: 'Actor',
        });

        template = await session.createTemplate({
          steps: [
            {
              type: StepTypeEnum.EMAIL,
              subject: 'Password reset',
              content: [
                {
                  type: EmailBlockTypeEnum.TEXT,
                  content: 'This are the text contents of the template for {{firstName}}',
                },
              ],
              filters: [
                {
                  isNegated: false,
                  type: 'GROUP',
                  value: FieldLogicalOperatorEnum.AND,
                  children: [
                    {
                      field: 'name',
                      value: 'Test {{actor.firstName}}',
                      operator: FieldOperatorEnum.EQUAL,
                      on: FilterPartTypeEnum.PAYLOAD,
                    },
                  ],
                },
              ],
            },
          ],
        });

        await novuClient.trigger({
          workflowId: template.triggers[0].identifier,
          to: [subscriber.subscriberId],
          payload: {
            firstName: 'Testing of User Name',
            urlVariable: '/test/url/path',
            name: 'Test Actor',
          },
          actor: actorSubscriber.subscriberId,
        });

        await session.waitForJobCompletion(template._id);

        const messages = await messageRepository.count({
          _environmentId: session.environment._id,
          _templateId: template._id,
        });

        expect(messages).to.equal(1);
      });

      it('should filter by tenant variables data', async function () {
        const tenant = await tenantRepository.create({
          _organizationId: session.organization._id,
          _environmentId: session.environment._id,
          identifier: 'one_123',
          name: 'The one and only tenant',
          data: { value1: 'Best fighter', value2: 'Ever', count: 4 },
        });

        const templateWithVariants = await session.createTemplate({
          name: 'test email template',
          description: 'This is a test description',
          steps: [
            {
              name: 'Message Name',
              subject: 'Test email subject',
              preheader: 'Test email preheader',
              content: [{ type: EmailBlockTypeEnum.TEXT, content: 'This is a sample text block' }],
              type: StepTypeEnum.EMAIL,
              filters: [
                {
                  isNegated: false,
                  type: 'GROUP',
                  value: FieldLogicalOperatorEnum.AND,
                  children: [
                    {
                      on: FilterPartTypeEnum.TENANT,
                      field: 'data.count',
                      value: '{{payload.count}}',
                      operator: FieldOperatorEnum.LARGER,
                    },
                  ],
                },
              ],
            },
          ],
        });

        await novuClient.trigger({
          workflowId: templateWithVariants.triggers[0].identifier,
          to: [subscriber.subscriberId],
          payload: { count: 5 },
          tenant: { identifier: tenant.identifier },
        });

        await session.waitForJobCompletion(templateWithVariants._id);

        let messages = await messageRepository.find({
          _environmentId: session.environment._id,
          _templateId: templateWithVariants._id,
        });

        expect(messages.length).to.equal(0);

        await novuClient.trigger({
          workflowId: templateWithVariants.triggers[0].identifier,
          to: [subscriber.subscriberId],
          payload: { count: 1 },
          tenant: { identifier: tenant.identifier },
        });
        await session.waitForJobCompletion(templateWithVariants._id);

        messages = await messageRepository.find({
          _environmentId: session.environment._id,
          _templateId: templateWithVariants._id,
        });

        expect(messages.length).to.equal(1);
      });
      it('should trigger message with override integration identifier', async function () {
        const newSubscriberId = SubscriberRepository.createObjectId();
        const channelType = ChannelTypeEnum.EMAIL;

        template = await createTemplate(session, channelType);

        await sendTrigger(template, newSubscriberId);

        await session.waitForJobCompletion(template._id);

        const createdSubscriber = await subscriberRepository.findBySubscriberId(
          session.environment._id,
          newSubscriberId
        );

        let messages = await messageRepository.find({
          _environmentId: session.environment._id,
          _subscriberId: createdSubscriber?._id,
          channel: channelType,
        });

        expect(messages.length).to.be.equal(1);
        expect(messages[0].providerId).to.be.equal(EmailProviderIdEnum.SendGrid);

        const prodEnv = await environmentRepository.findOne({
          name: 'Production',
          _organizationId: session.organization._id,
        });

        const payload: CreateIntegrationRequestDto = {
          providerId: EmailProviderIdEnum.Mailgun,
          channel: 'email',
          credentials: { apiKey: '123', secretKey: 'abc' },
          environmentId: prodEnv?._id,
          active: true,
          check: false,
        };

        const { result } = await novuClient.integrations.create(payload);
        await sendTrigger(template, newSubscriberId, {}, { email: { integrationIdentifier: result.identifier } });

        await session.waitForJobCompletion(template._id);

        messages = await messageRepository.find(
          {
            _environmentId: session.environment._id,
            _subscriberId: createdSubscriber?._id,
            channel: channelType,
          },
          '',
          { sort: { createdAt: -1 } }
        );

        expect(messages.length).to.be.equal(2);
        expect(messages[0].providerId).to.be.equal(EmailProviderIdEnum.Mailgun);
      });

      describe('in-app avatar', () => {
        it('should send the message with choosed system avatar', async () => {
          const firstStepUuid = uuid();
          template = await session.createTemplate({
            steps: [
              {
                type: StepTypeEnum.IN_APP,
                content: 'Hello world!',
                uuid: firstStepUuid,
                actor: {
                  type: ActorTypeEnum.SYSTEM_ICON,
                  data: SystemAvatarIconEnum.WARNING,
                },
              },
            ],
          });

          await novuClient.trigger({
            workflowId: template.triggers[0].identifier,
            to: [subscriber.subscriberId],
            payload: {},
          });

          await session.waitForJobCompletion(template?._id);

          const messages = await messageRepository.find({
            _environmentId: session.environment._id,
            _subscriberId: subscriber._id,
            channel: StepTypeEnum.IN_APP,
          });

          expect(messages.length).to.equal(1);
          expect(messages[0].actor).to.be.ok;
          expect(messages[0].actor?.type).to.eq(ActorTypeEnum.SYSTEM_ICON);
          expect(messages[0].actor?.data).to.eq(SystemAvatarIconEnum.WARNING);
        });

        it('should send the message with custom system avatar url', async () => {
          const firstStepUuid = uuid();
          const avatarUrl = 'https://gravatar.com/avatar/5246ec47a6a90ef2bcd29f0ef7d2faa6?s=400&d=robohash&r=x';

          template = await session.createTemplate({
            steps: [
              {
                type: StepTypeEnum.IN_APP,
                content: 'Hello world!',
                uuid: firstStepUuid,
                actor: {
                  type: ActorTypeEnum.SYSTEM_CUSTOM,
                  data: avatarUrl,
                },
              },
            ],
          });

          await novuClient.trigger({
            workflowId: template.triggers[0].identifier,
            to: [subscriber.subscriberId],
            payload: {},
          });

          await session.waitForJobCompletion(template?._id);

          const messages = await messageRepository.find({
            _environmentId: session.environment._id,
            _subscriberId: subscriber._id,
            channel: StepTypeEnum.IN_APP,
          });

          expect(messages.length).to.equal(1);
          expect(messages[0].actor).to.be.ok;
          expect(messages[0].actor?.type).to.eq(ActorTypeEnum.SYSTEM_CUSTOM);
          expect(messages[0].actor?.data).to.eq(avatarUrl);
        });

        it('should send the message with the actor avatar', async () => {
          const firstStepUuid = uuid();
          const avatarUrl = 'https://gravatar.com/avatar/5246ec47a6a90ef2bcd29f0ef7d2faa6?s=400&d=robohash&r=x';

          const actor = await subscriberService.createSubscriber({ avatar: avatarUrl });

          template = await session.createTemplate({
            steps: [
              {
                type: StepTypeEnum.IN_APP,
                content: 'Hello world!',
                uuid: firstStepUuid,
                actor: {
                  type: ActorTypeEnum.USER,
                  data: null,
                },
              },
            ],
          });

          await novuClient.trigger({
            workflowId: template.triggers[0].identifier,
            to: [subscriber.subscriberId],
            payload: {},
            actor: actor.subscriberId,
          });

          await session.waitForJobCompletion(template?._id);

          const messages = await messageRepository.find({
            _environmentId: session.environment._id,
            _subscriberId: subscriber._id,
            channel: StepTypeEnum.IN_APP,
          });

          expect(messages.length).to.equal(1);
          expect(messages[0].actor).to.be.ok;
          expect(messages[0].actor?.type).to.eq(ActorTypeEnum.USER);
          expect(messages[0].actor?.data).to.eq(null);
          expect(messages[0]._actorId).to.eq(actor._id);
        });
      });

      describe('seen/read filter', () => {
        it('should filter in app seen/read step', async function () {
          const firstStepUuid = uuid();
          template = await session.createTemplate({
            steps: [
              {
                type: StepTypeEnum.IN_APP,
                content: 'Not Delayed {{customVar}}' as string,
                uuid: firstStepUuid,
              },
              {
                type: StepTypeEnum.DELAY,
                content: '',
                metadata: {
                  unit: DigestUnitEnum.SECONDS,
                  amount: 2,
                  type: DelayTypeEnum.REGULAR,
                },
              },
              {
                type: StepTypeEnum.IN_APP,
                content: 'Hello world {{customVar}}' as string,
                filters: [
                  {
                    isNegated: false,
                    type: 'GROUP',
                    value: FieldLogicalOperatorEnum.AND,
                    children: [
                      {
                        on: FilterPartTypeEnum.PREVIOUS_STEP,
                        stepType: PreviousStepTypeEnum.READ,
                        step: firstStepUuid,
                      },
                    ],
                  },
                ],
              },
            ],
          });

          await novuClient.trigger({
            workflowId: template.triggers[0].identifier,
            to: [subscriber.subscriberId],
            payload: {
              customVar: 'Testing of User Name',
            },
          });

          await session.waitForWorkflowQueueCompletion();
          await session.waitForSubscriberQueueCompletion();

          const delayedJob = await jobRepository.findOne({
            _environmentId: session.environment._id,
            _templateId: template._id,
            type: StepTypeEnum.DELAY,
          });

          if (!delayedJob) {
            throw new Error();
          }

          expect(delayedJob.status).to.equal(JobStatusEnum.DELAYED);

          const messages = await messageRepository.find({
            _environmentId: session.environment._id,
            _subscriberId: subscriber._id,
            channel: StepTypeEnum.IN_APP,
          });

          expect(messages.length).to.equal(1);

          await session.waitForStandardQueueCompletion();
          await session.waitForDbJobCompletion({ templateId: template._id });

          const messagesAfter = await messageRepository.find({
            _environmentId: session.environment._id,
            _subscriberId: subscriber._id,
            channel: StepTypeEnum.IN_APP,
          });

          expect(messagesAfter.length).to.equal(1);
        });

        it('should filter email seen/read step', async function () {
          const firstStepUuid = uuid();
          template = await session.createTemplate({
            steps: [
              {
                type: StepTypeEnum.EMAIL,
                name: 'Message Name',
                subject: 'Test email subject',
                content: [{ type: EmailBlockTypeEnum.TEXT, content: 'This is a sample text block' }],
                uuid: firstStepUuid,
              },
              {
                type: StepTypeEnum.DELAY,
                content: '',
                metadata: {
                  unit: DigestUnitEnum.SECONDS,
                  amount: 2,
                  type: DelayTypeEnum.REGULAR,
                },
              },
              {
                type: StepTypeEnum.EMAIL,
                name: 'Message Name',
                subject: 'Test email subject',
                content: [{ type: EmailBlockTypeEnum.TEXT, content: 'This is a sample text block' }],
                filters: [
                  {
                    isNegated: false,
                    type: 'GROUP',
                    value: FieldLogicalOperatorEnum.AND,
                    children: [
                      {
                        on: FilterPartTypeEnum.PREVIOUS_STEP,
                        stepType: PreviousStepTypeEnum.READ,
                        step: firstStepUuid,
                      },
                    ],
                  },
                ],
              },
            ],
          });

          await novuClient.trigger({
            workflowId: template.triggers[0].identifier,
            to: [subscriber.subscriberId],
            payload: {
              customVar: 'Testing of User Name',
            },
          });

          await session.waitForWorkflowQueueCompletion();
          await session.waitForSubscriberQueueCompletion();

          const delayedJob = await jobRepository.findOne({
            _environmentId: session.environment._id,
            _templateId: template._id,
            type: StepTypeEnum.DELAY,
          });

          expect(delayedJob!.status).to.equal(JobStatusEnum.DELAYED);

          const messages = await messageRepository.find({
            _environmentId: session.environment._id,
            _subscriberId: subscriber._id,
            channel: StepTypeEnum.EMAIL,
          });

          expect(messages.length).to.equal(1);

          await executionDetailsRepository.create({
            _jobId: delayedJob!._parentId,
            _messageId: messages[0]._id,
            _environmentId: session.environment._id,
            _organizationId: session.organization._id,
            webhookStatus: EmailEventStatusEnum.OPENED,
          });

          await session.waitForJobCompletion(template._id);

          const messagesAfter = await messageRepository.find({
            _environmentId: session.environment._id,
            _subscriberId: subscriber._id,
            channel: StepTypeEnum.EMAIL,
          });

          expect(messagesAfter.length).to.equal(1);
        });
      });

      describe('workflow override', () => {
        beforeEach(async () => {
          workflowOverrideService = new WorkflowOverrideService({
            organizationId: session.organization._id,
            environmentId: session.environment._id,
          });
        });

        it('should override - active false', async function () {
          const subscriberOverride = SubscriberRepository.createObjectId();

          // Create active workflow
          const workflow = await createTemplate(session, ChannelTypeEnum.IN_APP);

          // Create workflow override with active false
          const { tenant } = await workflowOverrideService.createWorkflowOverride({
            workflowId: workflow._id,
            active: false,
          });

          if (!tenant) {
            throw new Error('Tenant not found');
          }

          const triggerResponse = await novuClient.trigger({
            workflowId: workflow.triggers[0].identifier,
            to: [subscriberOverride],
            tenant: tenant.identifier,
            payload: {
              firstName: 'Testing of User Name',
              urlVariable: '/test/url/path',
            },
          });

          expect(triggerResponse.result.status).to.equal('trigger_not_active');

          await session.waitForJobCompletion();

          const messages = await messageRepository.find({
            _environmentId: session.environment._id,
            _templateId: workflow._id,
          });

          expect(messages.length).to.equal(0);

          // Disable workflow - should not take effect, test for anomalies
          await notificationTemplateRepository.update(
            { _id: workflow._id, _environmentId: session.environment._id },
            { $set: { active: false } }
          );

          const triggerResponse2 = await novuClient.trigger({
            workflowId: workflow.triggers[0].identifier,
            to: [subscriberOverride],
            tenant: tenant.identifier,
            payload: {
              firstName: 'Testing of User Name',
              urlVariable: '/test/url/path',
            },
          });

          expect(triggerResponse2.result.status).to.equal('trigger_not_active');

          await session.waitForJobCompletion();

          const messages2 = await messageRepository.find({
            _environmentId: session.environment._id,
            _templateId: workflow._id,
          });

          expect(messages2.length).to.equal(0);
        });

        /*
         * TODO: we need to add support for Tenants in V2 Preferences
         * This test is skipped for now as the tenant-level active flag is not taken into account for V2 Preferences
         */
        it.skip('should override - active true', async function () {
          const subscriberOverride = SubscriberRepository.createObjectId();

          // Create active workflow
          const workflow = await createTemplate(session, ChannelTypeEnum.IN_APP);

          // Create active workflow override
          const { tenant } = await workflowOverrideService.createWorkflowOverride({
            workflowId: workflow._id,
            active: true,
          });

          if (!tenant) {
            throw new Error('Tenant not found');
          }

          const triggerResponse = await novuClient.trigger({
            workflowId: workflow.triggers[0].identifier,
            to: [subscriberOverride],
            tenant: tenant.identifier,
            payload: {
              firstName: 'Testing of User Name',
              urlVariable: '/test/url/path',
            },
          });

          expect(triggerResponse.result.status).to.equal('processed');

          await session.waitForJobCompletion();

          const messages = await messageRepository.find({
            _environmentId: session.environment._id,
            _templateId: workflow._id,
          });

          expect(messages.length).to.equal(1);

          // Disable workflow - should not take effect as override is active
          await notificationTemplateRepository.update(
            { _id: workflow._id, _environmentId: session.environment._id },
            { $set: { active: false } }
          );

          const triggerResponse2 = await novuClient.trigger({
            workflowId: workflow.triggers[0].identifier,
            to: [subscriberOverride],
            tenant: tenant.identifier,
            payload: {
              firstName: 'Testing of User Name',
              urlVariable: '/test/url/path',
            },
          });

          expect(triggerResponse2.result.status).to.equal('processed');

          await session.waitForJobCompletion();

          const messages2 = await messageRepository.find({
            _environmentId: session.environment._id,
            _templateId: workflow._id,
          });

          expect(messages2.length).to.equal(2);
        });

        /*
         * TODO: we need to add support for Tenants in V2 Preferences
         * This test is skipped for now as the tenant-level active flag is not taken into account for V2 Preferences
         */
        it.skip('should override - preference - should disable in app channel', async function () {
          const subscriberOverride = SubscriberRepository.createObjectId();

          // Create a workflow with in app channel enabled
          const workflow = await createTemplate(session, ChannelTypeEnum.IN_APP);

          // Create a workflow with in app channel disabled
          const { tenant } = await workflowOverrideService.createWorkflowOverride({
            workflowId: workflow._id,
            active: true,
            preferenceSettings: { in_app: false },
          });

          if (!tenant) {
            throw new Error('Tenant not found');
          }
          const triggerResponse = await novuClient.trigger({
            workflowId: workflow.triggers[0].identifier,
            to: [subscriberOverride],
            tenant: tenant.identifier,
            payload: {
              firstName: 'Testing of User Name',
              urlVariable: '/test/url/path',
            },
          });

          expect(triggerResponse.result.status).to.equal('processed');

          await session.waitForJobCompletion();

          const messages = await messageRepository.find({
            _environmentId: session.environment._id,
            _templateId: workflow._id,
          });

          expect(messages.length).to.equal(0);
        });

        /*
         * TODO: we need to add support for Tenants in V2 Preferences
         * This test is skipped for now as the tenant-level active flag is not taken into account for V2 Preferences
         */
        it.skip('should override - preference - should enable in app channel', async function () {
          const subscriberOverride = SubscriberRepository.createObjectId();

          // Create a workflow with in-app channel disabled
          const workflow = await session.createTemplate({
            steps: [
              {
                type: StepTypeEnum.IN_APP,
                content: 'Hello' as string,
              },
            ],
            preferenceSettingsOverride: { in_app: false },
          });

          // Create workflow override with in app channel enabled
          const { tenant } = await workflowOverrideService.createWorkflowOverride({
            workflowId: workflow._id,
            active: true,
            preferenceSettings: { in_app: true },
          });

          if (!tenant) {
            throw new Error('Tenant not found');
          }

          const triggerResponse = await novuClient.trigger({
            workflowId: workflow.triggers[0].identifier,
            to: [subscriberOverride],
            tenant: tenant.identifier,
            payload: {
              firstName: 'Testing of User Name',
              urlVariable: '/test/url/path',
            },
          });

          expect(triggerResponse.result.status).to.equal(201);
          expect(triggerResponse.result.status).to.equal('processed');

          await session.waitForJobCompletion();

          const messages = await messageRepository.find({
            _environmentId: session.environment._id,
            _templateId: workflow._id,
          });

          expect(messages.length).to.equal(1);
        });
      });
    });
  });

  async function sendTrigger(
    templateInner: NotificationTemplateEntity,
    newSubscriberIdInAppNotification: string,
    payload: Record<string, unknown> = {},
    overrides: Record<string, Record<string, unknown>> = {},
    tenant?: string,
    actor?: string
  ): Promise<TriggerEventResponseDto> {
    const request = {
      workflowId: templateInner.triggers[0].identifier,
      to: [{ subscriberId: newSubscriberIdInAppNotification, lastName: 'Smith', email: 'test@email.novu' }],
      payload: {
        organizationName: 'Umbrella Corp',
        compiledVariable: 'test-env',
        ...payload,
      },
      overrides,
      tenant,
      actor,
    };

    return (await novuClient.trigger(request)).result;
  }

  describe('Trigger Event v2 workflow - /v1/events/trigger (POST)', function () {
    let organizationRepository: CommunityOrganizationRepository;

    beforeEach(async () => {
      organizationRepository = new CommunityOrganizationRepository();
      // Set removeNovuBranding to true for these tests to avoid branding watermark in email content
      await organizationRepository.update({ _id: session.organization._id }, { removeNovuBranding: true });
    });

    afterEach(async () => {
      await messageRepository.delete({
        _environmentId: session.environment._id,
      });
    });

    it('should execute email step with custom string', async function test() {
      const workflowBody: CreateWorkflowDto = {
        name: 'Test Email Workflow',
        workflowId: 'test-email-workflow',
        __source: WorkflowCreationSourceEnum.DASHBOARD,
        steps: [
          {
            type: StepTypeEnum.EMAIL,
            name: 'Message Name',
            controlValues: {
              subject: 'Hello {{subscriber.lastName}}, Welcome!',
              editorType: 'html',
              body: 'body {{subscriber.lastName}}!',
            },
          },
        ],
      };

      const response = await session.testAgent.post('/v2/workflows').send(workflowBody);
      expect(response.status).to.equal(201);
      const workflow: WorkflowResponseDto = response.body.data;

      await novuClient.trigger({
        workflowId: workflow.workflowId,
        to: [subscriber.subscriberId],
        payload: {
          shouldExecute: false,
        },
      });
      await session.waitForJobCompletion(workflow._id);

      await session.waitForJobCompletion(workflow._id);
      const message = await messageRepository.find({
        _environmentId: session.environment._id,
        _subscriberId: subscriber._id,
      });

      expect(message.length).to.equal(1);
      expect(message[0].subject).to.equal(`Hello ${subscriber.lastName}, Welcome!`);
      expect(message[0].content).to.equal(`body ${subscriber.lastName}!`);
    });

    it('should execute email step with custom html', async function test() {
      const liquidJsHtml = `
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome Email</title>
                  </head>
                  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                      <h1 style="color: #2d3748;">Welcome {{subscriber.firstName}}!</h1>
                      <p style="font-size: 16px;">Hello {{subscriber.lastName}},</p>
                      <p style="font-size: 16px;">Thank you for joining us. We're excited to have you on board!</p>
                      <div style="margin: 30px 0;">
                        <a href="https://example.com/get-started" style="background-color: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Get Started</a>
                      </div>
                      <p style="font-size: 14px; color: #718096;">Best regards,<br>The Team</p>
                    </div>
                  </body>
                </html>
              `;
      const workflowBody: CreateWorkflowDto = {
        name: 'Test Email Workflow',
        workflowId: 'test-email-workflow',
        __source: WorkflowCreationSourceEnum.DASHBOARD,
        steps: [
          {
            type: StepTypeEnum.EMAIL,
            name: 'Message Name',
            controlValues: {
              subject: 'Hello {{subscriber.lastName}}, Welcome!',
              editorType: 'html',
              body: liquidJsHtml,
            },
          },
        ],
      };

      const response = await session.testAgent.post('/v2/workflows').send(workflowBody);
      expect(response.status).to.equal(201);
      const workflow: WorkflowResponseDto = response.body.data;

      await novuClient.trigger({
        workflowId: workflow.workflowId,
        to: [subscriber.subscriberId],
        payload: {
          shouldExecute: false,
        },
      });
      await session.waitForJobCompletion(workflow._id);

      await session.waitForJobCompletion(workflow._id);
      const message = await messageRepository.find({
        _environmentId: session.environment._id,
        _subscriberId: subscriber._id,
      });

      expect(message.length).to.equal(1);
      expect(message[0].subject).to.equal(`Hello ${subscriber.lastName}, Welcome!`);
      expect(message[0].content).to.include(`Welcome ${subscriber.firstName}!`);
      expect(message[0].content).to.include(`Hello ${subscriber.lastName},`);
    });

    it('should execute step based on conditions', async function () {
      const workflowBody: CreateWorkflowDto = {
        name: 'Test Step Conditions Workflow',
        workflowId: 'test-step-conditions-workflow',
        __source: WorkflowCreationSourceEnum.DASHBOARD,
        steps: [
          {
            type: StepTypeEnum.IN_APP,
            name: 'Message Name',
            controlValues: {
              body: 'Hello {{subscriber.lastName}}, Welcome!',
              skip: {
                '==': [{ var: 'payload.shouldExecute' }, true],
              },
            },
          },
        ],
      };

      const response = await session.testAgent.post('/v2/workflows').send(workflowBody);
      expect(response.status).to.equal(201);
      const workflow: WorkflowResponseDto = response.body.data;

      await novuClient.trigger({
        workflowId: workflow.workflowId,
        to: [subscriber.subscriberId],
        payload: {
          shouldExecute: false,
        },
      });
      await session.waitForJobCompletion(workflow._id);
      const skippedMessages = await messageRepository.find({
        _environmentId: session.environment._id,
        _subscriberId: subscriber._id,
      });
      expect(skippedMessages.length).to.equal(0);

      await novuClient.trigger({
        workflowId: workflow.workflowId,
        to: [subscriber.subscriberId],
        payload: {
          shouldExecute: true,
        },
      });
      await session.waitForJobCompletion(workflow._id);
      const notSkippedMessages = await messageRepository.find({
        _environmentId: session.environment._id,
        _subscriberId: subscriber._id,
      });
      expect(notSkippedMessages.length).to.equal(1);
    });

    it('should successfully trigger a workflow with SMS followed by in-app notification', async function () {
      const workflowBody: CreateWorkflowDto = {
        name: 'Test SMS -> In-App Workflow',
        workflowId: 'test-sms-inapp-workflow',
        __source: WorkflowCreationSourceEnum.DASHBOARD,
        steps: [
          {
            type: StepTypeEnum.SMS,
            name: 'SMS Message',
            controlValues: {
              body: 'Hello {{subscriber.firstName}}, this is a test SMS',
            },
          },
          {
            type: StepTypeEnum.IN_APP,
            name: 'In-App Message',
            controlValues: {
              body: 'Welcome {{subscriber.firstName}}! This is an in-app notification',
            },
          },
        ],
      };

      const response = await session.testAgent.post('/v2/workflows').send(workflowBody);
      expect(response.status).to.equal(201);
      const workflow: WorkflowResponseDto = response.body.data;

      subscriber = await subscriberService.createSubscriber({
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      });

      const triggerResponse = await novuClient.trigger({
        workflowId: workflow.workflowId,
        to: [subscriber.subscriberId],
        payload: {
          firstName: subscriber.firstName,
        },
      });

      expect(triggerResponse.result.status).to.equal('processed');
      expect(triggerResponse.result.acknowledged).to.equal(true);

      await session.waitForJobCompletion(workflow._id);

      const messages = await messageRepository.find({
        _environmentId: session.environment._id,
        _subscriberId: subscriber._id,
      });

      expect(messages.length).to.equal(2);

      const smsMessage = messages.find((message) => message.channel === ChannelTypeEnum.SMS);
      const inAppMessage = messages.find((message) => message.channel === ChannelTypeEnum.IN_APP);

      expect(smsMessage).to.exist;
      expect(inAppMessage).to.exist;

      expect(smsMessage?.content).to.equal('Hello John, this is a test SMS');
      expect(inAppMessage?.content).to.equal('Welcome John! This is an in-app notification');
    });

    it('should handle complex conditions logic with subscriber data', async function () {
      const workflowBody: CreateWorkflowDto = {
        name: 'Test Complex Conditions Logic',
        workflowId: 'test-complex-conditions-workflow',
        __source: WorkflowCreationSourceEnum.DASHBOARD,
        steps: [
          {
            type: StepTypeEnum.IN_APP,
            name: 'Message Name',
            controlValues: {
              body: 'Hello {{subscriber.lastName}}, Welcome!',
              skip: {
                and: [
                  {
                    or: [
                      { '==': [{ var: 'subscriber.firstName' }, 'John'] },
                      { '==': [{ var: 'subscriber.data.role' }, 'admin'] },
                    ],
                  },
                  {
                    and: [
                      { '>=': [{ var: 'payload.userScore' }, 100] },
                      { '==': [{ var: 'subscriber.lastName' }, 'Doe'] },
                    ],
                  },
                ],
              },
            },
          },
        ],
      };

      const response = await session.testAgent.post('/v2/workflows').send(workflowBody);
      expect(response.status).to.equal(201);
      const workflow: WorkflowResponseDto = response.body.data;

      // Should execute step - matches all conditions
      subscriber = await subscriberService.createSubscriber({
        firstName: 'John',
        lastName: 'Doe',
        data: { role: 'admin' },
      });

      await novuClient.trigger({
        workflowId: workflow.workflowId,
        to: [subscriber.subscriberId],
        payload: {
          userScore: 150,
        },
      });
      await session.waitForJobCompletion(workflow._id);
      const messages = await messageRepository.find({
        _environmentId: session.environment._id,
        _subscriberId: subscriber._id,
      });
      expect(messages.length).to.equal(1);

      // Should not execute step - doesn't match lastName condition
      subscriber = await subscriberService.createSubscriber({
        firstName: 'John',
        lastName: 'Smith',
        data: { role: 'admin' },
      });

      await novuClient.trigger({
        workflowId: workflow.workflowId,
        to: [subscriber.subscriberId],
        payload: {
          userScore: 150,
        },
      });

      await session.waitForJobCompletion(workflow._id);
      const skippedMessages1 = await messageRepository.find({
        _environmentId: session.environment._id,
        _subscriberId: subscriber._id,
      });
      expect(skippedMessages1.length).to.equal(0);

      // Should not execute step - doesn't match score condition
      subscriber = await subscriberService.createSubscriber({
        firstName: 'John',
        lastName: 'Doe',
        data: { role: 'admin' },
      });

      await novuClient.trigger({
        workflowId: workflow.workflowId,
        to: [subscriber.subscriberId],
        payload: {
          userScore: 50,
        },
      });

      await session.waitForJobCompletion(workflow._id);
      const skippedMessages2 = await messageRepository.find({
        _environmentId: session.environment._id,
        _subscriberId: subscriber._id,
      });
      expect(skippedMessages2.length).to.equal(0);
    });

    it('should exit execution if skip condition execution throws an error', async function () {
      const workflowBody: CreateWorkflowDto = {
        name: 'Test Complex Skip Logic',
        workflowId: 'test-complex-skip-workflow',
        __source: WorkflowCreationSourceEnum.DASHBOARD,
        steps: [
          {
            type: StepTypeEnum.IN_APP,
            name: 'Message Name',
            controlValues: {
              body: 'Hello {{subscriber.lastName}}, Welcome!',
              skip: { invalidOp: [1, 2] }, // INVALID OPERATOR
            },
          },
        ],
      };

      const response = await session.testAgent.post('/v2/workflows').send(workflowBody);
      expect(response.status).to.equal(201);
      const workflow: WorkflowResponseDto = response.body.data;

      subscriber = await subscriberService.createSubscriber({
        firstName: 'John',
        lastName: 'Doe',
        data: { role: 'admin' },
      });

      await novuClient.trigger({
        workflowId: workflow.workflowId,
        to: [subscriber.subscriberId],
        payload: {
          userScore: 150,
        },
      });
      await session.waitForJobCompletion(workflow._id);
      const executionDetails = await executionDetailsRepository.findOne({
        _environmentId: session.environment._id,
        _subscriberId: subscriber._id,
        channel: ChannelTypeEnum.IN_APP,
        status: ExecutionDetailsStatusEnum.FAILED,
      });

      expect(executionDetails?.raw).to.contain('Failed to evaluate rule');
      expect(executionDetails?.raw).to.contain('Unrecognized operation invalidOp');
    });
  });
});

async function createTemplate(session, channelType) {
  return await session.createTemplate({
    steps: [
      {
        type: channelType,
        content: 'Hello {{subscriber.lastName}}, Welcome to {{organizationName}}' as string,
      },
    ],
  });
}
async function createSimpleWorkflow(session) {
  return await session.createTemplate({
    steps: [
      {
        type: StepTypeEnum.EMAIL,
        content: 'Hello world {{firstName}}' as string,
      },
    ],
  });
}

function simpleTrigger(novuClient: Novu, template, subscriberID: string) {
  return novuClient.trigger({
    workflowId: template.triggers[0].identifier,
    to: [subscriberID],
    payload: {
      firstName: 'Testing of User Name',
      phone: '+972541111111',
    },
  });
}
