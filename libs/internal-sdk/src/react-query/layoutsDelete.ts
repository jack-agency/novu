/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import {
  MutationKey,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { NovuCore } from "../core.js";
import { layoutsDelete } from "../funcs/layoutsDelete.js";
import { combineSignals } from "../lib/primitives.js";
import { RequestOptions } from "../lib/sdks.js";
import * as operations from "../models/operations/index.js";
import { unwrapAsync } from "../types/fp.js";
import { useNovuContext } from "./_context.js";
import { MutationHookOptions } from "./_types.js";

export type LayoutsDeleteMutationVariables = {
  layoutId: string;
  idempotencyKey?: string | undefined;
  options?: RequestOptions;
};

export type LayoutsDeleteMutationData =
  | operations.LayoutsControllerDeleteResponse
  | undefined;

/**
 * Delete a layout
 *
 * @remarks
 * Removes a specific layout by its unique identifier **layoutId**
 */
export function useLayoutsDeleteMutation(
  options?: MutationHookOptions<
    LayoutsDeleteMutationData,
    Error,
    LayoutsDeleteMutationVariables
  >,
): UseMutationResult<
  LayoutsDeleteMutationData,
  Error,
  LayoutsDeleteMutationVariables
> {
  const client = useNovuContext();
  return useMutation({
    ...buildLayoutsDeleteMutation(client, options),
    ...options,
  });
}

export function mutationKeyLayoutsDelete(): MutationKey {
  return ["@novu/api", "Layouts", "delete"];
}

export function buildLayoutsDeleteMutation(
  client$: NovuCore,
  hookOptions?: RequestOptions,
): {
  mutationKey: MutationKey;
  mutationFn: (
    variables: LayoutsDeleteMutationVariables,
  ) => Promise<LayoutsDeleteMutationData>;
} {
  return {
    mutationKey: mutationKeyLayoutsDelete(),
    mutationFn: function layoutsDeleteMutationFn({
      layoutId,
      idempotencyKey,
      options,
    }): Promise<LayoutsDeleteMutationData> {
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
      return unwrapAsync(layoutsDelete(
        client$,
        layoutId,
        idempotencyKey,
        mergedOptions,
      ));
    },
  };
}
