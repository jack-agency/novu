/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import {
  MutationKey,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { NovuCore } from "../core.js";
import { topicsSubscriptionsDelete } from "../funcs/topicsSubscriptionsDelete.js";
import { combineSignals } from "../lib/primitives.js";
import { RequestOptions } from "../lib/sdks.js";
import * as components from "../models/components/index.js";
import * as operations from "../models/operations/index.js";
import { unwrapAsync } from "../types/fp.js";
import { useNovuContext } from "./_context.js";
import { MutationHookOptions } from "./_types.js";

export type TopicsSubscriptionsDeleteMutationVariables = {
  deleteTopicSubscriptionsRequestDto:
    components.DeleteTopicSubscriptionsRequestDto;
  topicKey: string;
  idempotencyKey?: string | undefined;
  options?: RequestOptions;
};

export type TopicsSubscriptionsDeleteMutationData =
  operations.TopicsControllerDeleteTopicSubscriptionsResponse;

/**
 * Delete topic subscriptions
 *
 * @remarks
 * Delete subscriptions for subscriberIds for a topic.
 */
export function useTopicsSubscriptionsDeleteMutation(
  options?: MutationHookOptions<
    TopicsSubscriptionsDeleteMutationData,
    Error,
    TopicsSubscriptionsDeleteMutationVariables
  >,
): UseMutationResult<
  TopicsSubscriptionsDeleteMutationData,
  Error,
  TopicsSubscriptionsDeleteMutationVariables
> {
  const client = useNovuContext();
  return useMutation({
    ...buildTopicsSubscriptionsDeleteMutation(client, options),
    ...options,
  });
}

export function mutationKeyTopicsSubscriptionsDelete(): MutationKey {
  return ["@novu/api", "Subscriptions", "delete"];
}

export function buildTopicsSubscriptionsDeleteMutation(
  client$: NovuCore,
  hookOptions?: RequestOptions,
): {
  mutationKey: MutationKey;
  mutationFn: (
    variables: TopicsSubscriptionsDeleteMutationVariables,
  ) => Promise<TopicsSubscriptionsDeleteMutationData>;
} {
  return {
    mutationKey: mutationKeyTopicsSubscriptionsDelete(),
    mutationFn: function topicsSubscriptionsDeleteMutationFn({
      deleteTopicSubscriptionsRequestDto,
      topicKey,
      idempotencyKey,
      options,
    }): Promise<TopicsSubscriptionsDeleteMutationData> {
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
      return unwrapAsync(topicsSubscriptionsDelete(
        client$,
        deleteTopicSubscriptionsRequestDto,
        topicKey,
        idempotencyKey,
        mergedOptions,
      ));
    },
  };
}
