import { parseStepVariables, type EnhancedParsedVariables } from '@/utils/parseStepVariables';
import { type JSONSchemaDefinition } from '@novu/shared';
import { JSONSchema7 } from 'json-schema';
import { useMemo } from 'react';

export function useParseVariables(
  schema?: JSONSchemaDefinition | JSONSchema7,
  digestStepId?: string,
  isPayloadSchemaEnabled?: boolean
): EnhancedParsedVariables {
  const parsedVariables = useMemo(() => {
    return schema
      ? parseStepVariables(schema, { digestStepId, isPayloadSchemaEnabled })
      : {
          variables: [],
          namespaces: [],
          primitives: [],
          arrays: [],
          enhancedVariables: [],
          isAllowedVariable: () => false,
        };
  }, [schema, digestStepId, isPayloadSchemaEnabled]);

  return parsedVariables;
}
