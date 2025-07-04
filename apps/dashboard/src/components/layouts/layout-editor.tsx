import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { RiCodeBlock, RiEdit2Line, RiEyeLine } from 'react-icons/ri';

import { useLayoutEditor } from './layout-editor-provider';
import { getControlsDefaultValues } from '@/utils/default-values';
import { Form, FormRoot } from '../primitives/form/form';
import { ResizableLayout } from '../workflow-editor/steps/layout/resizable-layout';
import { PanelHeader } from '../workflow-editor/steps/layout/panel-header';
import { LayoutPreviewContextPanel } from './layout-preview-context-panel';

export const LayoutEditor = () => {
  const { layout, isLayoutPreviewLoading } = useLayoutEditor();
  const defaultValues = useMemo(() => (layout ? getControlsDefaultValues(layout) : {}), [layout]);

  const form = useForm({
    defaultValues,
    values: layout?.controls.values,
    shouldFocusError: false,
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const onSubmit = async (formData: Record<string, unknown>) => {
    console.log(formData);
  };

  return (
    <div className="flex h-full w-full">
      <Form {...form}>
        <FormRoot
          id="edit-layout"
          autoComplete="off"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full w-full flex-col"
        >
          <ResizableLayout autoSaveId="layout-editor-page-layout">
            <ResizableLayout.ContextPanel>
              <PanelHeader icon={RiCodeBlock} title="Preview Context" className="p-3" />
              <div className="bg-bg-weak flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                  <LayoutPreviewContextPanel />
                </div>
              </div>
            </ResizableLayout.ContextPanel>

            <ResizableLayout.Handle />

            <ResizableLayout.MainContentPanel>
              <div className="flex min-h-0 flex-1 flex-col">
                <ResizableLayout autoSaveId="step-editor-content-layout">
                  <ResizableLayout.EditorPanel>
                    <PanelHeader icon={() => <RiEdit2Line />} title="Layout Editor" />
                    <div className="flex-1 overflow-y-auto">
                      <div className="h-full p-3">
                        <div>Editor</div>
                      </div>
                    </div>
                  </ResizableLayout.EditorPanel>

                  <ResizableLayout.Handle />

                  <ResizableLayout.PreviewPanel>
                    <PanelHeader icon={RiEyeLine} title="Preview" isLoading={isLayoutPreviewLoading} />
                    <div className="flex-1 overflow-hidden">
                      <div
                        className="bg-bg-weak relative h-full overflow-y-auto p-3"
                        style={{
                          backgroundImage:
                            'radial-gradient(circle, hsl(var(--neutral-alpha-100)) 1px, transparent 1px)',
                          backgroundSize: '20px 20px',
                        }}
                      >
                        <div>Preview</div>
                      </div>
                    </div>
                  </ResizableLayout.PreviewPanel>
                </ResizableLayout>
              </div>

              {/* <LayoutIssuesPanel step={step} /> */}
            </ResizableLayout.MainContentPanel>
          </ResizableLayout>
        </FormRoot>
      </Form>
    </div>
  );
};
