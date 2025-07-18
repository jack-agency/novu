import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useEnvironment } from '@/context/environment/hooks';
import { getIdFromSlug, LAYOUT_DIVIDER } from '@/utils/id-utils';
import { QueryKeys } from '@/utils/query-keys';
import { getLayout } from '@/api/layouts';

export const useFetchLayout = ({ layoutSlug }: { layoutSlug: string }) => {
  const { currentEnvironment } = useEnvironment();
  const layoutId = useMemo(() => getIdFromSlug({ slug: layoutSlug ?? '', divider: LAYOUT_DIVIDER }), [layoutSlug]);

  const {
    data: layout,
    isPending,
    error,
  } = useQuery({
    queryKey: [QueryKeys.fetchLayout, currentEnvironment?._id, layoutId],
    queryFn: () => getLayout({ environment: currentEnvironment!, layoutSlug }),
    enabled: !!currentEnvironment?._id && !!layoutSlug,
  });

  return {
    layout,
    isPending,
    error,
  };
};
