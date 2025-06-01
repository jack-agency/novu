import { Variable } from '@maily-to/core/extensions';
import React, { useImperativeHandle, useMemo, useRef } from 'react';
import { VariableList, VariableListRef } from '@/components/variable/variable-list';
import {
  DIGEST_PREVIEW_MAP,
  DIGEST_VARIABLES_ENUM,
  DIGEST_VARIABLES_FILTER_MAP,
  getDynamicDigestVariable,
} from '@/components/variable/utils/digest-variables';
import { useWorkflow } from '@/components/workflow-editor/workflow-provider';
import { useTelemetry } from '@/hooks/use-telemetry';
import { TelemetryEvent } from '@/utils/telemetry';
import { NewVariablePreview } from '@/components/variable/components/new-variable-preview';

interface ExtendedVariable extends Variable {
  type?: string;
  displayLabel?: string;
}

type VariableSuggestionsPopoverProps = {
  items: Variable[];
  onSelectItem: (item: Variable) => void;
  onCreateNewVariable?: (variableName: string) => Promise<void>;
};

type VariableSuggestionsPopoverRef = {
  moveUp: () => void;
  moveDown: () => void;
  select: () => void;
};

export const MailyVariablesListView = React.forwardRef(
  (
    { items, onSelectItem, onCreateNewVariable }: VariableSuggestionsPopoverProps,
    ref: React.Ref<VariableSuggestionsPopoverRef>
  ) => {
    const { digestStepBeforeCurrent } = useWorkflow();
    const track = useTelemetry();

    const options = useMemo(
      () =>
        items.map((item) => {
          const isDigestVariable = item.name in DIGEST_VARIABLES_FILTER_MAP;
          const isNewVariableItem = isNewVariable(item);

          if (isDigestVariable) {
            const { label } = getDynamicDigestVariable({
              type: item.name as DIGEST_VARIABLES_ENUM,
              digestStepName: digestStepBeforeCurrent?.stepId,
            });
            return {
              label,
              value: item.name,
              preview:
                item.name in DIGEST_PREVIEW_MAP
                  ? DIGEST_PREVIEW_MAP[item.name as keyof typeof DIGEST_PREVIEW_MAP]
                  : undefined,
            };
          }

          if (isNewVariableItem) {
            const displayLabel = hasDisplayLabel(item) ? item.displayLabel : (item as ExtendedVariable).name;

            return {
              label: displayLabel ?? '',
              value: item.name,
              preview: <NewVariablePreview />,
            };
          }

          return {
            label: item.name,
            value: item.name,
          };
        }),
      [digestStepBeforeCurrent?.stepId, items, onCreateNewVariable]
    );
    const variablesListRef = useRef<VariableListRef>(null);

    const onSelect = (value: string) => {
      const item = items.find((item) => item.name === value);

      if (!item) {
        return;
      }

      let selectedItem = item;

      /**
       *  If the variable is a digest variable,
       * we need to change the name to the dynamic value of the variable.
       */
      if (selectedItem.name in DIGEST_VARIABLES_FILTER_MAP) {
        const { value } = getDynamicDigestVariable({
          type: item.name as DIGEST_VARIABLES_ENUM,
          digestStepName: digestStepBeforeCurrent?.stepId,
        });
        selectedItem = { ...selectedItem, name: value };

        track(TelemetryEvent.DIGEST_VARIABLE_SELECTED, {
          type: item.name,
        });
      }

      onSelectItem(selectedItem);
    };

    useImperativeHandle(ref, () => ({
      moveUp: () => {
        variablesListRef.current?.prev();
      },
      moveDown: () => {
        variablesListRef.current?.next();
      },
      select: () => {
        variablesListRef.current?.select();
      },
    }));

    if (items.length === 0) {
      return null;
    }

    return (
      <VariableList
        ref={variablesListRef}
        className="rounded-md border shadow-md outline-none"
        options={options}
        onSelect={onSelect}
        title="Variables"
      />
    );
  }
);

function isNewVariable(item: Variable): item is ExtendedVariable {
  return 'type' in item && (item as ExtendedVariable).type === 'new-variable';
}

function hasDisplayLabel(item: Variable): item is ExtendedVariable {
  return 'displayLabel' in item && typeof (item as ExtendedVariable).displayLabel === 'string';
}
