/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import {
  MutationKey,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { NovuCore } from "../core.js";
import { integrationsCreate } from "../funcs/integrationsCreate.js";
import { combineSignals } from "../lib/primitives.js";
import { RequestOptions } from "../lib/sdks.js";
import * as components from "../models/components/index.js";
import * as operations from "../models/operations/index.js";
import { unwrapAsync } from "../types/fp.js";
import { useNovuContext } from "./_context.js";
import { MutationHookOptions } from "./_types.js";

export type IntegrationsCreateMutationVariables = {
  createIntegrationRequestDto: components.CreateIntegrationRequestDto;
  idempotencyKey?: string | undefined;
  options?: RequestOptions;
};

export type IntegrationsCreateMutationData =
  operations.IntegrationsControllerCreateIntegrationResponse;

/**
 * Create an integration
 *
 * @remarks
 * Create an integration for the current environment the user is based on the API key provided.
 *     Each provider supports different credentials, check the provider documentation for more details.
 */
export function useIntegrationsCreateMutation(
  options?: MutationHookOptions<
    IntegrationsCreateMutationData,
    Error,
    IntegrationsCreateMutationVariables
  >,
): UseMutationResult<
  IntegrationsCreateMutationData,
  Error,
  IntegrationsCreateMutationVariables
> {
  const client = useNovuContext();
  return useMutation({
    ...buildIntegrationsCreateMutation(client, options),
    ...options,
  });
}

export function mutationKeyIntegrationsCreate(): MutationKey {
  return ["@novu/api", "Integrations", "create"];
}

export function buildIntegrationsCreateMutation(
  client$: NovuCore,
  hookOptions?: RequestOptions,
): {
  mutationKey: MutationKey;
  mutationFn: (
    variables: IntegrationsCreateMutationVariables,
  ) => Promise<IntegrationsCreateMutationData>;
} {
  return {
    mutationKey: mutationKeyIntegrationsCreate(),
    mutationFn: function integrationsCreateMutationFn({
      createIntegrationRequestDto,
      idempotencyKey,
      options,
    }): Promise<IntegrationsCreateMutationData> {
      const mergedOptions = {
        ...hookOptions,
        ...options,
        fetchOptions: {
          ...hookOptions?.fetchOptions,
          ...options?.fetchOptions,
          signal: combineSignals(
            hookOptions?.fetchOptions?.signal,
            options?.fetchOptions?.signal,
          ),
        },
      };
      return unwrapAsync(integrationsCreate(
        client$,
        createIntegrationRequestDto,
        idempotencyKey,
        mergedOptions,
      ));
    },
  };
}
