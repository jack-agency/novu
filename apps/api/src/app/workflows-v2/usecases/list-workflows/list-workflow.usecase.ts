import { Injectable } from '@nestjs/common';

import { InstrumentUsecase } from '@novu/application-generic';
import { NotificationTemplateRepository } from '@novu/dal';
import { toWorkflowsMinifiedDtos } from '../../mappers/notification-template-mapper';
import { ListWorkflowsCommand } from './list-workflows.command';
import { ListWorkflowResponse } from '../../dtos';

@Injectable()
export class ListWorkflowsUseCase {
  constructor(private notificationTemplateRepository: NotificationTemplateRepository) {}

  @InstrumentUsecase()
  async execute(command: ListWorkflowsCommand): Promise<ListWorkflowResponse> {
    const res = await this.notificationTemplateRepository.getList(
      command.user.organizationId,
      command.user.environmentId,
      command.offset,
      command.limit,
      command.searchQuery,
      false,
      command.orderBy,
      command.orderDirection,
      command.tags,
      command.status
    );
    if (res.data === null || res.data === undefined) {
      return { workflows: [], totalCount: 0 };
    }

    return {
      workflows: toWorkflowsMinifiedDtos(res.data),
      totalCount: res.totalCount,
    };
  }
}
