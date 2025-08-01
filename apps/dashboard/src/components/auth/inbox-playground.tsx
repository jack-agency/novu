import { useEnvironment } from '@/context/environment/hooks';
import { useTriggerWorkflow } from '@/hooks/use-trigger-workflow';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiNotification2Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ONBOARDING_DEMO_WORKFLOW_ID } from '../../config';
import { useAuth } from '../../context/auth/hooks';
import { useTelemetry } from '../../hooks/use-telemetry';
import { useInitDemoWorkflow } from '../../hooks/use-init-demo-workflow';
import { ROUTES } from '../../utils/routes';
import { TelemetryEvent } from '../../utils/telemetry';
import { Button } from '../primitives/button';
import { InlineToast } from '../primitives/inline-toast';
import { showErrorToast, showSuccessToast } from '../primitives/sonner-helpers';
import { UsecasePlaygroundHeader } from '../usecase-playground-header';
import { CustomizeInbox } from './customize-inbox-playground';
import { InboxPreviewContent } from './inbox-preview-content';

export interface ActionConfig {
  label: string;
  redirect: {
    target: string;
    url: string;
  };
}

export interface InboxPlaygroundFormData {
  subject: string;
  body: string;
  primaryColor: string;
  foregroundColor: string;
  selectedStyle: string;
  openAccordion?: string;
  primaryAction: ActionConfig;
  secondaryAction: ActionConfig | null;
  enableTabs?: boolean;
}

const formSchema = z.object({
  subject: z.string().optional(),
  body: z.string(),
  primaryColor: z.string(),
  foregroundColor: z.string(),
  selectedStyle: z.string(),
  openAccordion: z.string().optional(),
  primaryAction: z.object({
    label: z.string(),
    redirect: z.object({
      target: z.string(),
      url: z.string(),
    }),
  }),
  secondaryAction: z
    .object({
      label: z.string(),
      redirect: z.object({
        target: z.string(),
        url: z.string(),
      }),
    })
    .nullable(),
  enableTabs: z.boolean().optional(),
});

const defaultFormValues = (): InboxPlaygroundFormData => ({
  subject: '**Welcome to Inbox!**',
  body: 'This is your first notification. Customize and explore more features.',
  primaryColor: '#7D52F4',
  foregroundColor: '#0E121B',
  selectedStyle: 'popover',
  openAccordion: 'layout',
  primaryAction: {
    label: 'Add to your app',
    redirect: {
      target: '_self',
      url: '/onboarding/inbox/embed',
    },
  },
  secondaryAction: null,
  enableTabs: true,
});

export function InboxPlayground() {
  const { currentEnvironment } = useEnvironment();
  const form = useForm<InboxPlaygroundFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues(),
    shouldFocusError: true,
  });

  const { triggerWorkflow, isPending } = useTriggerWorkflow();
  const auth = useAuth();
  const [hasNotificationBeenSent, setHasNotificationBeenSent] = useState(false);
  const navigate = useNavigate();
  const telemetry = useTelemetry();
  useInitDemoWorkflow(currentEnvironment!);

  const handleSendNotification = async () => {
    try {
      const formValues = form.getValues();

      await triggerWorkflow({
        name: ONBOARDING_DEMO_WORKFLOW_ID,
        to: auth.currentUser?._id,
        payload: {
          subject: formValues.subject,
          body: formValues.body,
          primaryActionLabel: formValues.primaryAction?.label || '',
          secondaryActionLabel: formValues.secondaryAction?.label || '',
          __source: 'inbox-onboarding',
        },
      });

      telemetry(TelemetryEvent.INBOX_NOTIFICATION_SENT, {
        subject: formValues.subject,
        hasSecondaryAction: !!formValues.secondaryAction,
      });

      setHasNotificationBeenSent(true);
      showSuccessToast('Notification sent successfully!');
    } catch (error) {
      showErrorToast('Failed to send notification');
    }
  };

  const handleImplementClick = () => {
    const { primaryColor, foregroundColor } = form.getValues();
    telemetry(TelemetryEvent.INBOX_IMPLEMENTATION_CLICKED, {
      primaryColor,
      foregroundColor,
    });
    const queryParams = new URLSearchParams({ primaryColor, foregroundColor }).toString();
    navigate(`${ROUTES.INBOX_EMBED}?${queryParams}`);
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'selectedStyle') {
        telemetry(TelemetryEvent.INBOX_PREVIEW_STYLE_CHANGED, {
          style: value.selectedStyle,
        });
      }

      if (['primaryColor', 'foregroundColor', 'subject', 'body'].includes(name || '')) {
        telemetry(TelemetryEvent.INBOX_CUSTOMIZATION_CHANGED, {
          field: name,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, telemetry]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <UsecasePlaygroundHeader
        title="Send your first Inbox notification"
        description="Customize your notification and hit 'Send notification' 🎉"
        skipPath={ROUTES.WELCOME}
        onSkip={() =>
          telemetry(TelemetryEvent.SKIP_ONBOARDING_CLICKED, {
            skippedFrom: 'inbox-playground',
          })
        }
      />

      <div className="flex flex-1">
        <div className="flex min-w-[480px] flex-col">
          <CustomizeInbox form={form} />

          {hasNotificationBeenSent && (
            <div className="px-3">
              <InlineToast
                variant="tip"
                title="Send Again?"
                description="Edit the notification and resend"
                ctaLabel="Send again"
                onCtaClick={handleSendNotification}
                isCtaLoading={isPending}
              />
            </div>
          )}

          <div className="bg-muted mt-auto border-t">
            <div className="flex justify-end gap-3 p-2">
              {!hasNotificationBeenSent ? (
                <Button
                  variant="secondary"
                  size="xs"
                  trailingIcon={RiNotification2Fill}
                  isLoading={isPending}
                  onClick={handleSendNotification}
                  disabled={isPending}
                >
                  Send notification
                </Button>
              ) : (
                <>
                  <Button size="xs" variant="secondary" onClick={handleImplementClick}>
                    Implement &lt;Inbox /&gt;
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="max-h-[610px] w-full border-l">
          <InboxPreviewContent
            hasNotificationBeenSent={hasNotificationBeenSent}
            selectedStyle={form.watch('selectedStyle')}
            primaryColor={form.watch('primaryColor')}
            foregroundColor={form.watch('foregroundColor')}
            enableTabs={form.watch('enableTabs')}
          />
        </div>
      </div>
    </div>
  );
}
