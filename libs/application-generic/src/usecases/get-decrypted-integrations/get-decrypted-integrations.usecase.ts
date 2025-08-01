import { Injectable } from '@nestjs/common';
import { IntegrationEntity, IntegrationRepository } from '@novu/dal';

import { decryptCredentials } from '../../encryption';
import { GetDecryptedIntegrationsCommand } from './get-decrypted-integrations.command';

@Injectable()
export class GetDecryptedIntegrations {
  constructor(private integrationRepository: IntegrationRepository) {}

  async execute(command: GetDecryptedIntegrationsCommand): Promise<IntegrationEntity[]> {
    const query: Partial<IntegrationEntity> & { _organizationId: string } = {
      _organizationId: command.organizationId,
    };

    if (command.active) {
      query.active = command.active;
    }

    if (command.channelType) {
      query.channel = command.channelType;
    }

    if (command.providerId) {
      query.providerId = command.providerId;
    }

    const foundIntegrations = command.findOne
      ? [await this.integrationRepository.findOne(query)]
      : await this.integrationRepository.find(query);

    return foundIntegrations
      .filter((integration) => integration)
      .map((integration: IntegrationEntity) => {
        if (command.returnCredentials === false) {
          // Don't include credentials
          const { credentials, ...integrationWithoutCredentials } = integration;

          return integrationWithoutCredentials as IntegrationEntity;
        }

        return GetDecryptedIntegrations.getDecryptedCredentials(integration);
      });
  }

  public static getDecryptedCredentials(integration: IntegrationEntity) {
    // eslint-disable-next-line no-param-reassign
    integration.credentials = decryptCredentials(integration.credentials);

    return integration;
  }
}
