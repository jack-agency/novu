import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { WorkflowResponseDto } from '@novu/shared';
import { QueryKeys } from '@/utils/query-keys';
import { getWorkflow } from '@/api/workflows';
import { useEnvironment } from '@/context/environment/hooks';
import { getIdFromSlug, WORKFLOW_DIVIDER } from '@/utils/id-utils';

export const useFetchWorkflow = ({ workflowSlug }: { workflowSlug?: string }) => {
  const { currentEnvironment } = useEnvironment();
  const workflowId = useMemo(
    () => getIdFromSlug({ slug: workflowSlug ?? '', divider: WORKFLOW_DIVIDER }),
    [workflowSlug]
  );

  const { data, isPending, error } = useQuery<WorkflowResponseDto>({
    queryKey: [QueryKeys.fetchWorkflow, currentEnvironment?._id, workflowId],
    queryFn: () => getWorkflow({ environment: currentEnvironment!, workflowSlug }),
    enabled: !!currentEnvironment?._id && !!workflowSlug,
  });

  return {
    workflow: data,
    isPending,
    error,
  };
};
