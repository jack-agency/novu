import { useState } from 'react';
import { FieldError, FieldValues, useFormContext } from 'react-hook-form';

import { Button } from '@/components/primitives/button';
import { Card, CardContent } from '@/components/primitives/card';
import { ControlInput } from '@/components/primitives/control-input';
import { FormField, FormItem, FormMessagePure } from '@/components/primitives/form/form';
import { useFormField } from '@/components/primitives/form/form-context';
import { HelpTooltipIndicator } from '@/components/primitives/help-tooltip-indicator';
import { Input, InputRoot } from '@/components/primitives/input';
import { useSaveForm } from '@/components/workflow-editor/steps/save-form-context';
import { useWorkflow } from '@/components/workflow-editor/workflow-provider';
import { useParseVariables } from '@/hooks/use-parse-variables';
import { useTelemetry } from '@/hooks/use-telemetry';
import { TelemetryEvent } from '@/utils/telemetry';
import React from 'react';
import { RiAddLine, RiDeleteBin6Line, RiInputField } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const dataObjectKey = 'data';

const InnerDataObject = ({ field }: { field: FieldValues }) => {
  const { saveForm } = useSaveForm();
  const { step, digestStepBeforeCurrent } = useWorkflow();
  const track = useTelemetry();

  const { variables, isAllowedVariable } = useParseVariables(step?.variables, digestStepBeforeCurrent?.stepId);

  const [currentPairs, setCurrentPairs] = useState(() => {
    const obj = field.value ?? {};
    return Object.entries(obj).map(([key, value]) => ({
      key,
      value: String(value ?? ''),
    }));
  });

  const updateFormField = (pairs: Array<{ key: string; value: string }>) => {
    setCurrentPairs(pairs);
    const uniquePairLength = new Set<string>(pairs.map((pair) => pair.key)).size;
    const hasNoDuplicates = uniquePairLength === pairs.length;

    if (hasNoDuplicates) {
      field.onChange(
        pairs.reduce(
          (acc, { key, value }) => {
            acc[key] = value;
            return acc;
          },
          {} as Record<string, string>
        )
      );
    }
  };

  const handleAddPair = () => {
    const newPairs = [...currentPairs, { key: '', value: '' }];
    updateFormField(newPairs);
    saveForm();
  };

  const handleUpdatePair = (index: number, field: 'key' | 'value', newValue: string) => {
    const newPairs = currentPairs.map((pair, i) => (i === index ? { ...pair, [field]: newValue } : pair));
    updateFormField(newPairs);
  };

  const handleRemovePair = (index: number) => {
    const newPairs = currentPairs.filter((_, i) => i !== index);
    updateFormField(newPairs);
    saveForm();
  };

  return (
    <FormItem className="bg-bg-weak flex flex-col gap-2 rounded-lg border border-neutral-200 p-2">
      <div className="flex items-center gap-2">
        <RiInputField className="text-feature size-4" />
        <span className="text-xs">Data object</span>
        <HelpTooltipIndicator
          text={
            <p>
              {`Add extra information about each notification entry that is not part of the standard notification fields, and customize each notification item rendering in <Inbox />. `}
              <Link
                className="text-primary"
                to="https://docs.novu.co/platform/inbox/react/components/inbox#data-object"
                target="_blank"
              >
                Learn more
              </Link>
            </p>
          }
        />
      </div>
      <Card className="rounded-md">
        <CardContent className="flex flex-col gap-1 p-2">
          <div className="flex flex-col gap-1">
            {currentPairs.map((pair, index) => {
              const isDuplicate = currentPairs.findIndex((p) => p.key === pair.key) < index;

              return (
                <div className="flex flex-col gap-1" key={index}>
                  <div className="grid grid-cols-[3fr,4fr,1.75rem] items-center gap-2">
                    <Input
                      placeholder="Insert property key..."
                      type="text"
                      value={pair.key}
                      onChange={(e) => handleUpdatePair(index, 'key', e.target.value)}
                    />
                    <InputRoot>
                      <ControlInput
                        multiline={false}
                        indentWithTab={false}
                        value={pair.value}
                        isAllowedVariable={isAllowedVariable}
                        placeholder="Insert text or variable..."
                        onChange={(newValue) => {
                          handleUpdatePair(index, 'value', typeof newValue === 'string' ? newValue : '');
                        }}
                        variables={variables}
                      />
                    </InputRoot>
                    <Button variant="secondary" mode="outline" className="h-7" onClick={() => handleRemovePair(index)}>
                      <RiDeleteBin6Line className="size-4" />
                    </Button>
                  </div>
                  <FormMessage keyName={isDuplicate ? '' : pair.key}>
                    {isDuplicate ? `The key ${pair.key} is already used. Please choose another key.` : null}
                  </FormMessage>
                </div>
              );
            })}
          </div>
          {currentPairs.length < 10 && (
            <Button
              variant="secondary"
              mode="lighter"
              className="self-start"
              onClick={() => {
                handleAddPair();
                track(TelemetryEvent.INBOX_DATA_OBJECT_PROPERTY_ADDED);
              }}
            >
              <RiAddLine className="size-4" />
              Add property
            </Button>
          )}
        </CardContent>
      </Card>
    </FormItem>
  );
};

export const DataObject = () => {
  const { control } = useFormContext();

  return <FormField control={control} name={dataObjectKey} render={({ field }) => <InnerDataObject field={field} />} />;
};

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { keyName: string }
>((props, ref) => {
  const { error, formMessageId } = useFormField();

  const typedError = error as unknown as Record<string, FieldError>;

  const errorMessage = typedError?.[props.keyName]?.message;

  if (!errorMessage) {
    return null;
  }

  return (
    <FormMessagePure ref={ref} id={formMessageId} hasError={!!errorMessage} {...props}>
      {errorMessage}
    </FormMessagePure>
  );
});
