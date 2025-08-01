import type {
  CreateWorkflowDto,
  DuplicateWorkflowDto,
  IEnvironment,
  ListWorkflowResponse,
  PatchWorkflowDto,
  SyncWorkflowDto,
  UpdateWorkflowDto,
  WorkflowResponseDto,
  WorkflowTestDataResponseDto,
} from '@novu/shared';
import { delV2, getV2, patchV2, post, postV2, putV2 } from './api.client';

export const getWorkflow = async ({
  environment,
  workflowSlug,
  targetEnvironmentId,
}: {
  environment: IEnvironment;
  workflowSlug?: string;
  targetEnvironmentId?: string;
}): Promise<WorkflowResponseDto> => {
  const { data } = await getV2<{ data: WorkflowResponseDto }>(
    `/workflows/${workflowSlug}?${targetEnvironmentId ? `environmentId=${targetEnvironmentId}` : ''}`,
    {
      environment,
    }
  );

  return data;
};

export const getWorkflows = async ({
  environment,
  limit,
  query,
  offset,
  orderBy,
  orderDirection,
  tags,
  status,
}: {
  environment: IEnvironment;
  limit: number;
  offset: number;
  query: string;
  orderBy?: string;
  orderDirection?: string;
  tags?: string[];
  status?: string[];
}): Promise<ListWorkflowResponse> => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    query,
  });

  if (orderBy) {
    params.append('orderBy', orderBy);
  }

  if (orderDirection) {
    params.append('orderDirection', orderDirection.toUpperCase());
  }

  if (tags && tags.length > 0) {
    tags.forEach((tag) => params.append('tags[]', tag));
  }

  if (status && status.length > 0) {
    status.forEach((s) => params.append('status[]', s));
  }

  const { data } = await getV2<{ data: ListWorkflowResponse }>(`/workflows?${params.toString()}`, { environment });

  return data;
};

export const getWorkflowTestData = async ({
  environment,
  workflowSlug,
}: {
  environment: IEnvironment;
  workflowSlug?: string;
}): Promise<WorkflowTestDataResponseDto> => {
  const { data } = await getV2<{ data: WorkflowTestDataResponseDto }>(`/workflows/${workflowSlug}/test-data`, {
    environment,
  });

  return data;
};

export async function triggerWorkflow({
  environment,
  name,
  payload,
  to,
}: {
  environment: IEnvironment;
  name: string;
  payload: unknown;
  to: unknown;
}) {
  return post<{ data: { transactionId?: string } }>(`/events/trigger`, {
    environment,
    body: {
      name,
      to,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payload: { ...(payload ?? {}), __source: (payload as any)?.__source ?? 'dashboard' },
    },
  });
}

export async function createWorkflow({
  environment,
  workflow,
}: {
  environment: IEnvironment;
  workflow: CreateWorkflowDto;
}) {
  return postV2<{ data: WorkflowResponseDto }>(`/workflows`, { environment, body: workflow });
}

export async function syncWorkflow({
  environment,
  workflowSlug,
  payload,
}: {
  environment: IEnvironment;
  workflowSlug: string;
  payload: SyncWorkflowDto;
}) {
  return putV2<{ data: WorkflowResponseDto }>(`/workflows/${workflowSlug}/sync`, { environment, body: payload });
}

export const updateWorkflow = async ({
  environment,
  workflow,
  workflowSlug,
}: {
  environment: IEnvironment;
  workflow: UpdateWorkflowDto;
  workflowSlug: string;
}): Promise<WorkflowResponseDto> => {
  const { data } = await putV2<{ data: WorkflowResponseDto }>(`/workflows/${workflowSlug}`, {
    environment,
    body: workflow,
  });

  return data;
};

export const deleteWorkflow = async ({
  environment,
  workflowSlug,
}: {
  environment: IEnvironment;
  workflowSlug: string;
}): Promise<void> => {
  return delV2(`/workflows/${workflowSlug}`, { environment });
};

export const patchWorkflow = async ({
  environment,
  workflow,
  workflowSlug,
}: {
  environment: IEnvironment;
  workflow: PatchWorkflowDto;
  workflowSlug: string;
}): Promise<WorkflowResponseDto> => {
  const res = await patchV2<{ data: WorkflowResponseDto }>(`/workflows/${workflowSlug}`, {
    environment,
    body: workflow,
  });

  return res.data;
};

export const duplicateWorkflow = async ({
  environment,
  workflow,
  workflowSlug,
}: {
  environment: IEnvironment;
  workflow: DuplicateWorkflowDto;
  workflowSlug: string;
}) => {
  return postV2<{ data: WorkflowResponseDto }>(`/workflows/${workflowSlug}/duplicate`, {
    environment,
    body: workflow,
  });
};
