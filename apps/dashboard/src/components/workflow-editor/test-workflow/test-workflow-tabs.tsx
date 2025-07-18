import { Button } from '@/components/primitives/button';
import { Form, FormRoot } from '@/components/primitives/form/form';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/primitives/resizable';
import { ToastClose, ToastIcon } from '@/components/primitives/sonner';
import { showErrorToast, showToast } from '@/components/primitives/sonner-helpers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/tabs';
import { buildDynamicFormSchema, TestWorkflowFormType } from '@/components/workflow-editor/schema';
import { TestWorkflowForm } from '@/components/workflow-editor/test-workflow/test-workflow-form';
import { TestWorkflowLogsSidebar } from '@/components/workflow-editor/test-workflow/test-workflow-logs-sidebar';
import { useTriggerWorkflow } from '@/hooks/use-trigger-workflow';
import { useIsPayloadSchemaEnabled } from '@/hooks/use-is-payload-schema-enabled';
import { buildRoute, ROUTES } from '@/utils/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { createMockObjectFromSchema, type WorkflowTestDataResponseDto } from '@novu/shared';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiPlayCircleLine } from 'react-icons/ri';
import { Link, useParams } from 'react-router-dom';
import { useWorkflow } from '../workflow-provider';

export const TestWorkflowTabs = ({ testData }: { testData?: WorkflowTestDataResponseDto }) => {
  const { environmentSlug = '', workflowSlug = '' } = useParams<{ environmentSlug: string; workflowSlug: string }>();
  const { workflow } = useWorkflow();
  const [transactionId, setTransactionId] = useState<string>();
  const isPayloadSchemaEnabled = useIsPayloadSchemaEnabled();

  const to = useMemo(() => createMockObjectFromSchema(testData?.to ?? {}), [testData]);

  const payload = useMemo(() => {
    // Use workflow payloadExample if available and feature flag is enabled
    if (isPayloadSchemaEnabled && workflow?.payloadExample) {
      return workflow.payloadExample;
    }

    // Fallback to test data payload
    return createMockObjectFromSchema(testData?.payload ?? {});
  }, [testData, workflow?.payloadExample, isPayloadSchemaEnabled]);

  const form = useForm<TestWorkflowFormType>({
    mode: 'onSubmit',
    resolver: zodResolver(buildDynamicFormSchema({ to: testData?.to ?? {} })),
    values: { to, payload: JSON.stringify(payload, null, 2) },
  });

  const { handleSubmit } = form;
  const { triggerWorkflow, isPending } = useTriggerWorkflow();

  const onSubmit = async (data: TestWorkflowFormType) => {
    try {
      const {
        data: { transactionId: newTransactionId },
      } = await triggerWorkflow({ name: workflow?.workflowId ?? '', to: data.to, payload: data.payload });

      if (!newTransactionId) {
        return showToast({
          variant: 'lg',
          children: ({ close }) => (
            <>
              <ToastIcon variant="error" />
              <div className="flex flex-col gap-2">
                <span className="font-medium">Test workflow failed</span>
                <span className="text-foreground-600 inline">
                  Workflow <span className="font-bold">{workflow?.name}</span> cannot be triggered. Ensure that it is
                  active and requires not further actions.
                </span>
              </div>
              <ToastClose onClick={close} />
            </>
          ),
          options: {
            position: 'bottom-right',
          },
        });
      }

      setTransactionId(newTransactionId);
    } catch (e) {
      showErrorToast(
        e instanceof Error ? e.message : 'There was an error triggering the workflow.',
        'Failed to trigger workflow'
      );
    }
  };

  return (
    <div className="h-full w-full">
      <Form {...form}>
        <FormRoot onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-1">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={70} minSize={40} className="h-full">
              <Tabs defaultValue="workflow" className="-mt-[1px] flex h-full flex-1 flex-col" value="trigger">
                <TabsList variant="regular" className="items-center">
                  <TabsTrigger value="workflow" asChild variant="regular" size="xl">
                    <Link
                      to={buildRoute(ROUTES.EDIT_WORKFLOW, {
                        environmentSlug,
                        workflowSlug,
                      })}
                    >
                      Workflow
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="trigger" asChild variant="regular" size="xl">
                    <Link
                      to={buildRoute(ROUTES.TEST_WORKFLOW, {
                        environmentSlug,
                        workflowSlug,
                      })}
                    >
                      Trigger
                    </Link>
                  </TabsTrigger>
                  <div className="my-auto ml-auto flex items-center gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="xs"
                      mode="gradient"
                      isLoading={isPending}
                      leadingIcon={RiPlayCircleLine}
                    >
                      Test workflow
                    </Button>
                  </div>
                </TabsList>
                <TabsContent value="trigger" className="mt-0 flex w-full flex-1 flex-col overflow-hidden">
                  <TestWorkflowForm workflow={workflow} />
                </TabsContent>
              </Tabs>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={30} minSize={30} maxSize={50}>
              <TestWorkflowLogsSidebar transactionId={transactionId} workflow={workflow} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </FormRoot>
      </Form>
    </div>
  );
};
