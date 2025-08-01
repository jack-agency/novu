/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import {
  MutationKey,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { NovuCore } from "../core.js";
import { layoutsCreate } from "../funcs/layoutsCreate.js";
import { combineSignals } from "../lib/primitives.js";
import { RequestOptions } from "../lib/sdks.js";
import * as components from "../models/components/index.js";
import * as operations from "../models/operations/index.js";
import { unwrapAsync } from "../types/fp.js";
import { useNovuContext } from "./_context.js";
import { MutationHookOptions } from "./_types.js";

export type LayoutsCreateMutationVariables = {
  createLayoutDto: components.CreateLayoutDto;
  idempotencyKey?: string | undefined;
  options?: RequestOptions;
};

export type LayoutsCreateMutationData =
  operations.LayoutsControllerCreateResponse;

/**
 * Create a layout
 *
 * @remarks
 * Creates a new layout in the Novu Cloud environment
 */
export function useLayoutsCreateMutation(
  options?: MutationHookOptions<
    LayoutsCreateMutationData,
    Error,
    LayoutsCreateMutationVariables
  >,
): UseMutationResult<
  LayoutsCreateMutationData,
  Error,
  LayoutsCreateMutationVariables
> {
  const client = useNovuContext();
  return useMutation({
    ...buildLayoutsCreateMutation(client, options),
    ...options,
  });
}

export function mutationKeyLayoutsCreate(): MutationKey {
  return ["@novu/api", "Layouts", "create"];
}

export function buildLayoutsCreateMutation(
  client$: NovuCore,
  hookOptions?: RequestOptions,
): {
  mutationKey: MutationKey;
  mutationFn: (
    variables: LayoutsCreateMutationVariables,
  ) => Promise<LayoutsCreateMutationData>;
} {
  return {
    mutationKey: mutationKeyLayoutsCreate(),
    mutationFn: function layoutsCreateMutationFn({
      createLayoutDto,
      idempotencyKey,
      options,
    }): Promise<LayoutsCreateMutationData> {
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
      return unwrapAsync(layoutsCreate(
        client$,
        createLayoutDto,
        idempotencyKey,
        mergedOptions,
      ));
    },
  };
}
