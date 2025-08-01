import { Form, FormRoot } from '@/components/primitives/form/form';
import { getControlsDefaultValues } from '@/utils/default-values';
import { flattenIssues, updateStepInWorkflow } from '@/components/workflow-editor/step-utils';
import { ChatTabs } from '@/components/workflow-editor/steps/chat/chat-tabs';
import { CommonCustomControlValues } from '@/components/workflow-editor/steps/common/common-custom-control-values';
import { EmailTabs } from '@/components/workflow-editor/steps/email/email-tabs';
import { InAppTabs } from '@/components/workflow-editor/steps/in-app/in-app-tabs';
import { PushTabs } from '@/components/workflow-editor/steps/push/push-tabs';
import { SaveFormContext } from '@/components/workflow-editor/steps/save-form-context';
import { SmsTabs } from '@/components/workflow-editor/steps/sms/sms-tabs';
import { UpdateWorkflowFn } from '@/components/workflow-editor/workflow-provider';
import { useDataRef } from '@/hooks/use-data-ref';
import { useFormAutosave } from '@/hooks/use-form-autosave';
import { type StepResponseDto, StepTypeEnum, StepUpdateDto, type WorkflowResponseDto } from '@novu/shared';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

const STEP_TYPE_TO_TEMPLATE_FORM: Record<StepTypeEnum, (args: StepEditorProps) => React.JSX.Element | null> = {
  [StepTypeEnum.EMAIL]: EmailTabs,
  [StepTypeEnum.CHAT]: ChatTabs,
  [StepTypeEnum.IN_APP]: InAppTabs,
  [StepTypeEnum.SMS]: SmsTabs,
  [StepTypeEnum.PUSH]: PushTabs,
  [StepTypeEnum.DIGEST]: CommonCustomControlValues,
  [StepTypeEnum.DELAY]: CommonCustomControlValues,
  [StepTypeEnum.TRIGGER]: () => null,
  [StepTypeEnum.CUSTOM]: () => null,
};

export type StepEditorProps = {
  workflow: WorkflowResponseDto;
  step: StepResponseDto;
};

type ConfigureStepTemplateFormProps = StepEditorProps & {
  update: UpdateWorkflowFn;
};

export const ConfigureStepTemplateForm = (props: ConfigureStepTemplateFormProps) => {
  const { workflow, step, update } = props;
  const defaultValues = useMemo(() => getControlsDefaultValues(step), [step]);

  const form = useForm({
    defaultValues,
    values: step.controls.values,
    shouldFocusError: false,
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const { onBlur, saveForm } = useFormAutosave({
    previousData: defaultValues,
    form,
    save: (data, { onSuccess }) => {
      const updateStepData: Partial<StepUpdateDto> = {
        controlValues: data,
      };
      update(updateStepInWorkflow(workflow, step.stepId, updateStepData), { onSuccess });
    },
  });

  // Run saveForm on unmount
  const saveFormRef = useDataRef(saveForm);
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      saveFormRef.current();
    };
  }, [saveFormRef]);

  const setIssuesFromStep = useCallback(() => {
    const stepIssues = flattenIssues(step.issues?.controls);
    const currentErrors = form.formState.errors;

    // Clear errors that are not in stepIssues
    Object.keys(currentErrors).forEach((key) => {
      if (!stepIssues[key]) {
        form.clearErrors(key);
      }
    });

    // @ts-expect-error - isNew doesn't exist on StepResponseDto and it's too much work to override the @novu/shared types now. See useUpdateWorkflow.ts for more details
    if (!step.isNew) {
      Object.entries(stepIssues).forEach(([key, value]) => {
        form.setError(key as string, { message: value });
      });
    }
  }, [form, step]);

  useEffect(() => {
    setIssuesFromStep();
  }, [setIssuesFromStep]);

  const TemplateForm = STEP_TYPE_TO_TEMPLATE_FORM[step.type];

  const value = useMemo(() => ({ saveForm }), [saveForm]);

  return (
    <Form {...form}>
      <FormRoot className="flex h-full flex-col" onBlur={onBlur}>
        <SaveFormContext.Provider value={value}>
          <TemplateForm workflow={workflow} step={step} />
        </SaveFormContext.Provider>
      </FormRoot>
    </Form>
  );
};
