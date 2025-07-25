import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/primitives/accordion';
import { Form, FormRoot } from '@/components/primitives/form/form';
import { Label } from '@/components/primitives/label';
import { Separator } from '@/components/primitives/separator';
import { useEnvironment } from '@/context/environment/hooks';
import { ROUTES } from '@/utils/routes';
import { ChannelTypeEnum, IIntegration, IProviderConfig, PermissionsEnum } from '@novu/shared';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { RiInputField } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { InlineToast } from '../../../components/primitives/inline-toast';
import { cn } from '../../../utils/ui';
import { EnvironmentDropdown } from '../../side-navigation/environment-dropdown';
import { CredentialsSection } from './integration-credentials';
import { GeneralSettings } from './integration-general-settings';
import { isDemoIntegration } from './utils/helpers';
import { Protect } from '@/utils/protect';

type IntegrationFormData = {
  name: string;
  identifier: string;
  credentials: Record<string, string>;
  active: boolean;
  check: boolean;
  primary: boolean;
  environmentId: string;
};

type IntegrationConfigurationProps = {
  provider: IProviderConfig;
  integration?: IIntegration;
  onSubmit: (data: IntegrationFormData) => void;
  mode: 'create' | 'update';
  isChannelSupportPrimary?: boolean;
  hasOtherProviders?: boolean;
  isReadOnly?: boolean;
};

function generateSlug(name: string): string {
  return name
    ?.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function IntegrationConfiguration({
  provider,
  integration,
  onSubmit,
  mode,
  isChannelSupportPrimary,
  hasOtherProviders,
  isReadOnly,
}: IntegrationConfigurationProps) {
  const navigate = useNavigate();
  const { currentEnvironment, environments } = useEnvironment();

  const form = useForm<IntegrationFormData>({
    defaultValues: integration
      ? {
          name: integration.name,
          identifier: integration.identifier,
          active: integration.active,
          primary: integration.primary ?? false,
          credentials: integration.credentials as Record<string, string>,
          environmentId: integration._environmentId,
        }
      : {
          name: provider?.displayName ?? '',
          identifier: generateSlug(provider?.displayName ?? ''),
          active: true,
          primary: true,
          credentials: {},
          environmentId: currentEnvironment?._id ?? '',
        },
  });

  const { handleSubmit, control, setValue } = form;

  const name = useWatch({ control, name: 'name' });
  const environmentId = useWatch({ control, name: 'environmentId' });

  useEffect(() => {
    if (mode === 'create') {
      setValue('identifier', generateSlug(name));
    }
  }, [name, mode, setValue]);

  const isDemo = integration && isDemoIntegration(integration.providerId);

  return (
    <Form {...form}>
      <FormRoot id="integration-configuration-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex items-center justify-between gap-2 p-3">
          <Label className="text-sm" htmlFor="environmentId">
            Environment
          </Label>
          <div className={cn('w-full', mode === 'update' ? 'max-w-[160px]' : 'max-w-[260px]')}>
            <EnvironmentDropdown
              className="w-full shadow-none"
              disabled={mode === 'update' || isReadOnly}
              currentEnvironment={environments?.find((env) => env._id === environmentId)}
              data={environments}
              onChange={(value) => {
                const env = environments?.find((env) => env.name === value);

                if (env) {
                  setValue('environmentId', env._id);
                }
              }}
            />
          </div>
        </div>

        <Accordion type="single" collapsible defaultValue="layout" className="p-3">
          <AccordionItem value="layout">
            <AccordionTrigger>
              <div className="flex items-center gap-1 text-xs">
                <RiInputField className="text-feature size-5" />
                General Settings
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <GeneralSettings
                control={control}
                mode={mode}
                isReadOnly={isReadOnly}
                hidePrimarySelector={!isChannelSupportPrimary}
                disabledPrimary={!hasOtherProviders && integration?.primary}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator className="mb-0 mt-0" />

        {isDemo ? (
          <div className="p-3">
            <InlineToast
              variant={'warning'}
              title="Demo Integration"
              description={`This is a demo ${
                provider?.channel === 'email' ? 'email' : 'SMS'
              } integration intended for testing purposes only. It is limited to 300 ${
                provider?.channel === 'email' ? 'messages' : 'SMS'
              } per month.${
                provider?.channel === 'email'
                  ? ' You can only send emails from it to the email address you are logged in with.'
                  : ''
              }`}
            />
          </div>
        ) : (
          <div className="p-3">
            <Protect permission={PermissionsEnum.INTEGRATION_WRITE}>
              <Accordion type="single" collapsible defaultValue="credentials">
                <AccordionItem value="credentials">
                  <AccordionTrigger>
                    <div className="flex items-center gap-1 text-xs">
                      <RiInputField className="text-feature size-5" />
                      Integration Credentials
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CredentialsSection provider={provider} control={control} isReadOnly={isReadOnly} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Protect>

            {/* TODO: This is a temporary solution to show the guide only for in-app channel, 
              we need to replace it with dedicated view per integration channel */}
            {integration && integration.channel === ChannelTypeEnum.IN_APP && !integration.connected ? (
              <InlineToast
                variant={'tip'}
                className="mt-3"
                title="Integrate in less than 4 minutes"
                ctaLabel="Get started"
                onCtaClick={() => navigate(ROUTES.INBOX_EMBED + `?environmentId=${integration._environmentId}`)}
              />
            ) : (
              provider?.docReference && (
                <InlineToast
                  variant={'tip'}
                  className="mt-3"
                  title="Configure Integration"
                  description="To learn more about how to configure your integration, please refer to the documentation."
                  ctaLabel="View Guide"
                  onCtaClick={() => {
                    window.open(provider?.docReference ?? '', '_blank');
                  }}
                />
              )
            )}
          </div>
        )}
      </FormRoot>
    </Form>
  );
}
