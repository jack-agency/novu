/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import {
  InvalidateQueryFilters,
  QueryClient,
  QueryFunctionContext,
  QueryKey,
  useQuery,
  UseQueryResult,
  useSuspenseQuery,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { NovuCore } from "../core.js";
import { subscribersNotificationsFeed } from "../funcs/subscribersNotificationsFeed.js";
import { combineSignals } from "../lib/primitives.js";
import { RequestOptions } from "../lib/sdks.js";
import * as operations from "../models/operations/index.js";
import { unwrapAsync } from "../types/fp.js";
import { useNovuContext } from "./_context.js";
import {
  QueryHookOptions,
  SuspenseQueryHookOptions,
  TupleToPrefixes,
} from "./_types.js";

export type SubscribersNotificationsFeedQueryData =
  operations.SubscribersV1ControllerGetNotificationsFeedResponse;

/**
 * Retrieve subscriber notifications
 *
 * @remarks
 * Retrieve subscriber in-app (inbox) notifications by its unique key identifier **subscriberId**.
 */
export function useSubscribersNotificationsFeed(
  request: operations.SubscribersV1ControllerGetNotificationsFeedRequest,
  options?: QueryHookOptions<SubscribersNotificationsFeedQueryData>,
): UseQueryResult<SubscribersNotificationsFeedQueryData, Error> {
  const client = useNovuContext();
  return useQuery({
    ...buildSubscribersNotificationsFeedQuery(
      client,
      request,
      options,
    ),
    ...options,
  });
}

/**
 * Retrieve subscriber notifications
 *
 * @remarks
 * Retrieve subscriber in-app (inbox) notifications by its unique key identifier **subscriberId**.
 */
export function useSubscribersNotificationsFeedSuspense(
  request: operations.SubscribersV1ControllerGetNotificationsFeedRequest,
  options?: SuspenseQueryHookOptions<SubscribersNotificationsFeedQueryData>,
): UseSuspenseQueryResult<SubscribersNotificationsFeedQueryData, Error> {
  const client = useNovuContext();
  return useSuspenseQuery({
    ...buildSubscribersNotificationsFeedQuery(
      client,
      request,
      options,
    ),
    ...options,
  });
}

export function prefetchSubscribersNotificationsFeed(
  queryClient: QueryClient,
  client$: NovuCore,
  request: operations.SubscribersV1ControllerGetNotificationsFeedRequest,
): Promise<void> {
  return queryClient.prefetchQuery({
    ...buildSubscribersNotificationsFeedQuery(
      client$,
      request,
    ),
  });
}

export function setSubscribersNotificationsFeedData(
  client: QueryClient,
  queryKeyBase: [
    subscriberId: string,
    parameters: {
      page?: number | undefined;
      limit?: number | undefined;
      read?: boolean | undefined;
      seen?: boolean | undefined;
      payload?: string | undefined;
      idempotencyKey?: string | undefined;
    },
  ],
  data: SubscribersNotificationsFeedQueryData,
): SubscribersNotificationsFeedQueryData | undefined {
  const key = queryKeySubscribersNotificationsFeed(...queryKeyBase);

  return client.setQueryData<SubscribersNotificationsFeedQueryData>(key, data);
}

export function invalidateSubscribersNotificationsFeed(
  client: QueryClient,
  queryKeyBase: TupleToPrefixes<
    [
      subscriberId: string,
      parameters: {
        page?: number | undefined;
        limit?: number | undefined;
        read?: boolean | undefined;
        seen?: boolean | undefined;
        payload?: string | undefined;
        idempotencyKey?: string | undefined;
      },
    ]
  >,
  filters?: Omit<InvalidateQueryFilters, "queryKey" | "predicate" | "exact">,
): Promise<void> {
  return client.invalidateQueries({
    ...filters,
    queryKey: ["@novu/api", "Notifications", "feed", ...queryKeyBase],
  });
}

export function invalidateAllSubscribersNotificationsFeed(
  client: QueryClient,
  filters?: Omit<InvalidateQueryFilters, "queryKey" | "predicate" | "exact">,
): Promise<void> {
  return client.invalidateQueries({
    ...filters,
    queryKey: ["@novu/api", "Notifications", "feed"],
  });
}

export function buildSubscribersNotificationsFeedQuery(
  client$: NovuCore,
  request: operations.SubscribersV1ControllerGetNotificationsFeedRequest,
  options?: RequestOptions,
): {
  queryKey: QueryKey;
  queryFn: (
    context: QueryFunctionContext,
  ) => Promise<SubscribersNotificationsFeedQueryData>;
} {
  return {
    queryKey: queryKeySubscribersNotificationsFeed(request.subscriberId, {
      page: request.page,
      limit: request.limit,
      read: request.read,
      seen: request.seen,
      payload: request.payload,
      idempotencyKey: request.idempotencyKey,
    }),
    queryFn: async function subscribersNotificationsFeedQueryFn(
      ctx,
    ): Promise<SubscribersNotificationsFeedQueryData> {
      const sig = combineSignals(ctx.signal, options?.fetchOptions?.signal);
      const mergedOptions = {
        ...options,
        fetchOptions: { ...options?.fetchOptions, signal: sig },
      };

      return unwrapAsync(subscribersNotificationsFeed(
        client$,
        request,
        mergedOptions,
      ));
    },
  };
}

export function queryKeySubscribersNotificationsFeed(
  subscriberId: string,
  parameters: {
    page?: number | undefined;
    limit?: number | undefined;
    read?: boolean | undefined;
    seen?: boolean | undefined;
    payload?: string | undefined;
    idempotencyKey?: string | undefined;
  },
): QueryKey {
  return ["@novu/api", "Notifications", "feed", subscriberId, parameters];
}
