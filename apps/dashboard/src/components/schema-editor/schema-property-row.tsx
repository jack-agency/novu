import { memo, useMemo } from 'react';
import { Controller, Path, useFormContext, useWatch, type Control } from 'react-hook-form';

import { Checkbox } from '@/components/primitives/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/primitives/tooltip';
import { cn } from '@/utils/ui';

import type { JSONSchema7 } from './json-schema';
import { getMarginClassPx } from './utils/ui-helpers';
import type { PropertyListItem, SchemaEditorFormValues } from './utils/validation-schema';
import type { VariableUsageInfo } from './utils/check-variable-usage';

import { PropertyNameInput } from './components/property-name-input';
import { PropertyTypeSelector } from './components/property-type-selector';
import { PropertyActions } from './components/property-actions';
import { EnumSection } from './components/enum-section';
import { ObjectSection } from './components/object-section';
import { ArraySection } from './components/array-section';
import { useSchemaPropertyType } from './hooks/use-schema-property-type';
import { usePropertyPaths } from './hooks/use-property-paths';

export interface SchemaPropertyRowProps {
  control: Control<SchemaEditorFormValues>;
  index: number;
  pathPrefix: Path<SchemaEditorFormValues>;
  onDeleteProperty: () => void;
  indentationLevel?: number;
  highlightedPropertyKey?: string | null;
  variableUsageInfo?: VariableUsageInfo;
  parentPath?: string;
  onCheckVariableUsage?: (keyName: string, parentPath: string) => VariableUsageInfo;
  className?: string;
  depth?: number;
}

export const SchemaPropertyRow = memo<SchemaPropertyRowProps>(function SchemaPropertyRow(props) {
  const {
    control,
    pathPrefix,
    onDeleteProperty,
    indentationLevel = 0,
    highlightedPropertyKey,
    variableUsageInfo,
    parentPath = '',
    onCheckVariableUsage,
    className,
    depth = 0,
  } = props;

  const { setValue, getValues } = useFormContext();

  const propertyListItem = useWatch({ control, name: pathPrefix }) as PropertyListItem;

  // Use the custom hook for paths
  const paths = usePropertyPaths(pathPrefix);

  const currentDefinition = propertyListItem?.definition as JSONSchema7 | undefined;
  const currentType = useSchemaPropertyType(currentDefinition);
  const currentKeyName = propertyListItem?.keyName;

  const currentFullPath = useMemo(() => {
    return parentPath ? `${parentPath}.${currentKeyName}` : currentKeyName;
  }, [parentPath, currentKeyName]);

  const isHighlighted = currentKeyName && currentKeyName === highlightedPropertyKey;
  const isKeyNameEmpty = !currentKeyName || currentKeyName.trim() === '';

  if (!propertyListItem) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-col',
        className,
        isHighlighted ? 'overflow-hidden rounded-[8px] bg-[rgba(193,221,251,0.50)]' : ''
      )}
    >
      <div className={cn('flex items-center gap-2', getMarginClassPx(indentationLevel))}>
        <PropertyNameInput fieldPath={paths.keyName} control={control} />
        <PropertyTypeSelector
          definitionPath={paths.definition}
          control={control}
          setValue={setValue}
          getValues={getValues}
        />

        <div className="flex items-center gap-1.5">
          <Controller
            name={paths.isRequired}
            control={control}
            render={({ field }) => {
              return (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Checkbox
                        id={`${pathPrefix}-isRequired-checkbox`}
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        disabled={isKeyNameEmpty}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Required property</TooltipContent>
                </Tooltip>
              );
            }}
          />
        </div>

        <PropertyActions
          definitionPath={paths.definition}
          propertyKeyForDisplay={currentKeyName || ''}
          isRequiredPath={paths.isRequired}
          onDeleteProperty={onDeleteProperty}
          isDisabled={isKeyNameEmpty}
          variableUsageInfo={variableUsageInfo}
        />
      </div>

      {/* Type-specific sections */}
      {currentType === 'enum' && (
        <EnumSection enumArrayPath={paths.enum} control={control} indentationLevel={indentationLevel} />
      )}

      {currentType === 'object' && (
        <ObjectSection
          nestedPropertyListPath={paths.nestedPropertyList}
          control={control}
          indentationLevel={indentationLevel}
          currentFullPath={currentFullPath}
          onCheckVariableUsage={onCheckVariableUsage}
          depth={depth}
        />
      )}

      {currentType === 'array' && currentDefinition && (
        <ArraySection
          itemSchemaObjectPath={paths.itemSchemaObject}
          itemPropertiesListPath={paths.itemPropertiesList}
          control={control}
          setValue={setValue}
          getValues={getValues}
          indentationLevel={indentationLevel}
          currentFullPath={currentFullPath}
          onCheckVariableUsage={onCheckVariableUsage}
          depth={depth}
        />
      )}
    </div>
  );
});
