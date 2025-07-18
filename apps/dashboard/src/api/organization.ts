import type { UpdateExternalOrganizationDto, IEnvironment } from '@novu/shared';
import { post, get, patch } from './api.client';

export type GetOrganizationSettingsDto = {
  removeNovuBranding: boolean;
  defaultLocale: string;
};

export type UpdateOrganizationSettingsDto = {
  removeNovuBranding?: boolean;
  defaultLocale?: string;
};

export function updateClerkOrgMetadata({
  data,
  environment,
}: {
  data: UpdateExternalOrganizationDto;
  environment: IEnvironment;
}) {
  return post('/clerk/organization', { environment, body: data });
}

export async function getOrganizationSettings({
  environment,
}: {
  environment: IEnvironment;
}): Promise<{ data: GetOrganizationSettingsDto }> {
  return get('/organizations/settings', { environment });
}

export async function updateOrganizationSettings({
  data,
  environment,
}: {
  data: UpdateOrganizationSettingsDto;
  environment: IEnvironment;
}): Promise<{ data: GetOrganizationSettingsDto }> {
  return patch('/organizations/settings', { environment, body: data });
}
