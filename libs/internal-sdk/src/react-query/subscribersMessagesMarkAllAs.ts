/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import {
  MutationKey,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { NovuCore } from "../core.js";
import { subscribersMessagesMarkAllAs } from "../funcs/subscribersMessagesMarkAllAs.js";
import { combineSignals } from "../lib/primitives.js";
import { RequestOptions } from "../lib/sdks.js";
import * as components from "../models/components/index.js";
import * as operations from "../models/operations/index.js";
import { unwrapAsync } from "../types/fp.js";
import { useNovuContext } from "./_context.js";
import { MutationHookOptions } from "./_types.js";

export type SubscribersMessagesMarkAllAsMutationVariables = {
  messageMarkAsRequestDto: components.MessageMarkAsRequestDto;
  subscriberId: string;
  idempotencyKey?: string | undefined;
  options?: RequestOptions;
};

export type SubscribersMessagesMarkAllAsMutationData =
  operations.SubscribersV1ControllerMarkMessagesAsResponse;

/**
 * Update notifications state
 *
 * @remarks
 * Update subscriber's multiple in-app (inbox) notifications state such as seen, read, unseen or unread by **subscriberId**.
 *       **messageId** is of type mongodbId of notifications
 */
export function useSubscribersMessagesMarkAllAsMutation(
  options?: MutationHookOptions<
    SubscribersMessagesMarkAllAsMutationData,
    Error,
    SubscribersMessagesMarkAllAsMutationVariables
  >,
): UseMutationResult<
  SubscribersMessagesMarkAllAsMutationData,
  Error,
  SubscribersMessagesMarkAllAsMutationVariables
> {
  const client = useNovuContext();
  return useMutation({
    ...buildSubscribersMessagesMarkAllAsMutation(client, options),
    ...options,
  });
}

export function mutationKeySubscribersMessagesMarkAllAs(): MutationKey {
  return ["@novu/api", "Messages", "markAllAs"];
}

export function buildSubscribersMessagesMarkAllAsMutation(
  client$: NovuCore,
  hookOptions?: RequestOptions,
): {
  mutationKey: MutationKey;
  mutationFn: (
    variables: SubscribersMessagesMarkAllAsMutationVariables,
  ) => Promise<SubscribersMessagesMarkAllAsMutationData>;
} {
  return {
    mutationKey: mutationKeySubscribersMessagesMarkAllAs(),
    mutationFn: function subscribersMessagesMarkAllAsMutationFn({
      messageMarkAsRequestDto,
      subscriberId,
      idempotencyKey,
      options,
    }): Promise<SubscribersMessagesMarkAllAsMutationData> {
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
      return unwrapAsync(subscribersMessagesMarkAllAs(
        client$,
        messageMarkAsRequestDto,
        subscriberId,
        idempotencyKey,
        mergedOptions,
      ));
    },
  };
}
