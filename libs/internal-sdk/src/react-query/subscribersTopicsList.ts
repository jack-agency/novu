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
import { subscribersTopicsList } from "../funcs/subscribersTopicsList.js";
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

export type SubscribersTopicsListQueryData =
  operations.SubscribersControllerListSubscriberTopicsResponse;

/**
 * Retrieve subscriber subscriptions
 *
 * @remarks
 * Retrieve subscriber's topic subscriptions by its unique key identifier **subscriberId**.
 *     Checkout all available filters in the query section.
 */
export function useSubscribersTopicsList(
  request: operations.SubscribersControllerListSubscriberTopicsRequest,
  options?: QueryHookOptions<SubscribersTopicsListQueryData>,
): UseQueryResult<SubscribersTopicsListQueryData, Error> {
  const client = useNovuContext();
  return useQuery({
    ...buildSubscribersTopicsListQuery(
      client,
      request,
      options,
    ),
    ...options,
  });
}

/**
 * Retrieve subscriber subscriptions
 *
 * @remarks
 * Retrieve subscriber's topic subscriptions by its unique key identifier **subscriberId**.
 *     Checkout all available filters in the query section.
 */
export function useSubscribersTopicsListSuspense(
  request: operations.SubscribersControllerListSubscriberTopicsRequest,
  options?: SuspenseQueryHookOptions<SubscribersTopicsListQueryData>,
): UseSuspenseQueryResult<SubscribersTopicsListQueryData, Error> {
  const client = useNovuContext();
  return useSuspenseQuery({
    ...buildSubscribersTopicsListQuery(
      client,
      request,
      options,
    ),
    ...options,
  });
}

export function prefetchSubscribersTopicsList(
  queryClient: QueryClient,
  client$: NovuCore,
  request: operations.SubscribersControllerListSubscriberTopicsRequest,
): Promise<void> {
  return queryClient.prefetchQuery({
    ...buildSubscribersTopicsListQuery(
      client$,
      request,
    ),
  });
}

export function setSubscribersTopicsListData(
  client: QueryClient,
  queryKeyBase: [
    subscriberId: string,
    parameters: {
      after?: string | undefined;
      before?: string | undefined;
      limit?: number | undefined;
      orderDirection?: operations.QueryParamOrderDirection | undefined;
      orderBy?: string | undefined;
      includeCursor?: boolean | undefined;
      key?: string | undefined;
      idempotencyKey?: string | undefined;
    },
  ],
  data: SubscribersTopicsListQueryData,
): SubscribersTopicsListQueryData | undefined {
  const key = queryKeySubscribersTopicsList(...queryKeyBase);

  return client.setQueryData<SubscribersTopicsListQueryData>(key, data);
}

export function invalidateSubscribersTopicsList(
  client: QueryClient,
  queryKeyBase: TupleToPrefixes<
    [
      subscriberId: string,
      parameters: {
        after?: string | undefined;
        before?: string | undefined;
        limit?: number | undefined;
        orderDirection?: operations.QueryParamOrderDirection | undefined;
        orderBy?: string | undefined;
        includeCursor?: boolean | undefined;
        key?: string | undefined;
        idempotencyKey?: string | undefined;
      },
    ]
  >,
  filters?: Omit<InvalidateQueryFilters, "queryKey" | "predicate" | "exact">,
): Promise<void> {
  return client.invalidateQueries({
    ...filters,
    queryKey: ["@novu/api", "Topics", "list", ...queryKeyBase],
  });
}

export function invalidateAllSubscribersTopicsList(
  client: QueryClient,
  filters?: Omit<InvalidateQueryFilters, "queryKey" | "predicate" | "exact">,
): Promise<void> {
  return client.invalidateQueries({
    ...filters,
    queryKey: ["@novu/api", "Topics", "list"],
  });
}

export function buildSubscribersTopicsListQuery(
  client$: NovuCore,
  request: operations.SubscribersControllerListSubscriberTopicsRequest,
  options?: RequestOptions,
): {
  queryKey: QueryKey;
  queryFn: (
    context: QueryFunctionContext,
  ) => Promise<SubscribersTopicsListQueryData>;
} {
  return {
    queryKey: queryKeySubscribersTopicsList(request.subscriberId, {
      after: request.after,
      before: request.before,
      limit: request.limit,
      orderDirection: request.orderDirection,
      orderBy: request.orderBy,
      includeCursor: request.includeCursor,
      key: request.key,
      idempotencyKey: request.idempotencyKey,
    }),
    queryFn: async function subscribersTopicsListQueryFn(
      ctx,
    ): Promise<SubscribersTopicsListQueryData> {
      const sig = combineSignals(ctx.signal, options?.fetchOptions?.signal);
      const mergedOptions = {
        ...options,
        fetchOptions: { ...options?.fetchOptions, signal: sig },
      };

      return unwrapAsync(subscribersTopicsList(
        client$,
        request,
        mergedOptions,
      ));
    },
  };
}

export function queryKeySubscribersTopicsList(
  subscriberId: string,
  parameters: {
    after?: string | undefined;
    before?: string | undefined;
    limit?: number | undefined;
    orderDirection?: operations.QueryParamOrderDirection | undefined;
    orderBy?: string | undefined;
    includeCursor?: boolean | undefined;
    key?: string | undefined;
    idempotencyKey?: string | undefined;
  },
): QueryKey {
  return ["@novu/api", "Topics", "list", subscriberId, parameters];
}
