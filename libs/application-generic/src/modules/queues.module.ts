import { DynamicModule, Module, OnApplicationShutdown, Provider } from '@nestjs/common';

import { JobTopicNameEnum } from '@novu/shared';
import { MessageRepository } from '@novu/dal';
import {
  ActiveJobsMetricQueueServiceHealthIndicator,
  InboundParseQueueServiceHealthIndicator,
  StandardQueueServiceHealthIndicator,
  SubscriberProcessQueueHealthIndicator,
  WebSocketsQueueServiceHealthIndicator,
  WorkflowQueueServiceHealthIndicator,
} from '../health';
import { ReadinessService, WorkflowInMemoryProviderService, SocketWorkerService } from '../services';
import {
  ActiveJobsMetricQueueService,
  InboundParseQueueService,
  StandardQueueService,
  SubscriberProcessQueueService,
  WebSocketsQueueService,
  WorkflowQueueService,
} from '../services/queues';
import { ActiveJobsMetricWorkerService } from '../services/workers';
import { featureFlagsService } from '../custom-providers';

const memoryQueueService = {
  provide: WorkflowInMemoryProviderService,
  useFactory: async () => {
    const memoryService = new WorkflowInMemoryProviderService();

    await memoryService.initialize();

    return memoryService;
  },
};

const INTERNAL_MODULE_PROVIDERS = [memoryQueueService, featureFlagsService];
const BASE_PROVIDERS: Provider[] = [ReadinessService];

@Module({
  providers: [],
  exports: [],
})
export class QueuesModule implements OnApplicationShutdown {
  static forRoot(entities: JobTopicNameEnum[] = []): DynamicModule {
    if (!entities.length) {
      // eslint-disable-next-line no-param-reassign
      entities = Object.values(JobTopicNameEnum);
    }

    const healthIndicators = [];
    const tokenList = [];
    const DYNAMIC_PROVIDERS = [...BASE_PROVIDERS];

    for (const entity of entities) {
      switch (entity) {
        case JobTopicNameEnum.INBOUND_PARSE_MAIL:
          healthIndicators.push(InboundParseQueueServiceHealthIndicator);
          tokenList.push(InboundParseQueueService);
          DYNAMIC_PROVIDERS.push(InboundParseQueueService, InboundParseQueueServiceHealthIndicator);
          break;
        case JobTopicNameEnum.WORKFLOW:
          healthIndicators.push(WorkflowQueueServiceHealthIndicator);
          tokenList.push(WorkflowQueueService);
          DYNAMIC_PROVIDERS.push(WorkflowQueueService, WorkflowQueueServiceHealthIndicator);
          break;
        case JobTopicNameEnum.WEB_SOCKETS:
          healthIndicators.push(WebSocketsQueueServiceHealthIndicator);
          tokenList.push(WebSocketsQueueService);
          DYNAMIC_PROVIDERS.push(
            MessageRepository,
            SocketWorkerService,
            WebSocketsQueueService,
            WebSocketsQueueServiceHealthIndicator
          );
          break;
        case JobTopicNameEnum.STANDARD:
          tokenList.push(StandardQueueService);
          DYNAMIC_PROVIDERS.push(StandardQueueService, StandardQueueServiceHealthIndicator);
          break;
        case JobTopicNameEnum.PROCESS_SUBSCRIBER:
          healthIndicators.push(SubscriberProcessQueueHealthIndicator);
          tokenList.push(SubscriberProcessQueueService);
          DYNAMIC_PROVIDERS.push(SubscriberProcessQueueService, SubscriberProcessQueueHealthIndicator);
          break;
        case JobTopicNameEnum.ACTIVE_JOBS_METRIC:
          healthIndicators.push(ActiveJobsMetricQueueServiceHealthIndicator);
          tokenList.push(ActiveJobsMetricQueueService);
          DYNAMIC_PROVIDERS.push(
            ActiveJobsMetricQueueService,
            ActiveJobsMetricQueueServiceHealthIndicator,
            ActiveJobsMetricWorkerService
          );
          break;
        default:
          break;
      }
    }

    DYNAMIC_PROVIDERS.push({
      provide: 'BULLMQ_LIST',
      useFactory: (...args: any[]) => {
        return args;
      },
      inject: tokenList,
    });

    DYNAMIC_PROVIDERS.push({
      provide: 'QUEUE_HEALTH_INDICATORS',
      useFactory: (...args: any[]) => {
        return args;
      },
      inject: healthIndicators,
    });

    return {
      module: QueuesModule,
      providers: [...DYNAMIC_PROVIDERS, ...INTERNAL_MODULE_PROVIDERS],
      exports: [...DYNAMIC_PROVIDERS],
    };
  }

  constructor(private workflowInMemoryProviderService: WorkflowInMemoryProviderService) {}

  async onApplicationShutdown() {
    await this.workflowInMemoryProviderService.shutdown();
  }
}
