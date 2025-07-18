import { ApiServiceLevelEnum, FeatureNameEnum, getFeatureForTierAsNumber, type GetSubscriptionDto } from '@novu/shared';
import { type OrganizationResource } from '@clerk/types';
import { IS_SELF_HOSTED } from '../config';

export const LOGS_DATE_RANGE_OPTIONS = [
  { value: '24', label: 'Last 24 Hours', ms: 24 * 60 * 60 * 1000 },
  { value: '168', label: '7 Days', ms: 7 * 24 * 60 * 60 * 1000 }, // 7 * 24
  { value: '720', label: '30 Days', ms: 30 * 24 * 60 * 60 * 1000 }, // 30 * 24
  { value: '1440', label: '60 Days', ms: 60 * 24 * 60 * 60 * 1000 }, // 60 * 24
  { value: '2160', label: '90 Days', ms: 90 * 24 * 60 * 60 * 1000 }, // 90 * 24
];

export function buildLogsDateFilters({
  organization,
  apiServiceLevel,
}: {
  organization: OrganizationResource;
  apiServiceLevel?: ApiServiceLevelEnum;
}) {
  const maxActivityFeedRetentionMs = getFeatureForTierAsNumber(
    FeatureNameEnum.PLATFORM_ACTIVITY_FEED_RETENTION,
    IS_SELF_HOSTED ? ApiServiceLevelEnum.UNLIMITED : apiServiceLevel || ApiServiceLevelEnum.FREE,
    true
  );

  return LOGS_DATE_RANGE_OPTIONS.map((option) => {
    const isLegacyFreeTier =
      apiServiceLevel === ApiServiceLevelEnum.FREE && organization && organization.createdAt < new Date('2025-02-28');

    // legacy free can go up to 30 days
    const legacyFreeMaxRetentionMs = 30 * 24 * 60 * 60 * 1000;
    const maxRetentionMs = isLegacyFreeTier ? legacyFreeMaxRetentionMs : maxActivityFeedRetentionMs;

    return {
      disabled: option.ms > maxRetentionMs,
      label: option.label,
      value: option.value,
    };
  });
}

export function getMaxAvailableLogsDateRange({
  subscription,
  organization,
}: Partial<{
  subscription: GetSubscriptionDto | null;
  organization: OrganizationResource | null;
}>) {
  if (!organization || !subscription) {
    return '24';
  }

  const lastAvailableLogsFilter = buildLogsDateFilters({
    organization,
    apiServiceLevel: subscription.apiServiceLevel,
  })
    .filter((option) => !option.disabled)
    .at(-1);

  return lastAvailableLogsFilter?.value ?? '24';
}
