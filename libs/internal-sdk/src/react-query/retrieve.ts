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
import { retrieve } from "../funcs/retrieve.js";
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

export type RetrieveQueryData = operations.LogsControllerGetLogsResponseBody;

export function useRetrieve(
  request: operations.LogsControllerGetLogsRequest,
  options?: QueryHookOptions<RetrieveQueryData>,
): UseQueryResult<RetrieveQueryData, Error> {
  const client = useNovuContext();
  return useQuery({
    ...buildRetrieveQuery(
      client,
      request,
      options,
    ),
    ...options,
  });
}

export function useRetrieveSuspense(
  request: operations.LogsControllerGetLogsRequest,
  options?: SuspenseQueryHookOptions<RetrieveQueryData>,
): UseSuspenseQueryResult<RetrieveQueryData, Error> {
  const client = useNovuContext();
  return useSuspenseQuery({
    ...buildRetrieveQuery(
      client,
      request,
      options,
    ),
    ...options,
  });
}

export function prefetchRetrieve(
  queryClient: QueryClient,
  client$: NovuCore,
  request: operations.LogsControllerGetLogsRequest,
): Promise<void> {
  return queryClient.prefetchQuery({
    ...buildRetrieveQuery(
      client$,
      request,
    ),
  });
}

export function setRetrieveData(
  client: QueryClient,
  queryKeyBase: [
    parameters: {
      page?: number | undefined;
      limit?: number | undefined;
      statusCodes?: Array<number> | undefined;
      url?: string | undefined;
      transactionId?: string | undefined;
      created?: number | undefined;
      idempotencyKey?: string | undefined;
    },
  ],
  data: RetrieveQueryData,
): RetrieveQueryData | undefined {
  const key = queryKeyRetrieve(...queryKeyBase);

  return client.setQueryData<RetrieveQueryData>(key, data);
}

export function invalidateRetrieve(
  client: QueryClient,
  queryKeyBase: TupleToPrefixes<
    [parameters: {
      page?: number | undefined;
      limit?: number | undefined;
      statusCodes?: Array<number> | undefined;
      url?: string | undefined;
      transactionId?: string | undefined;
      created?: number | undefined;
      idempotencyKey?: string | undefined;
    }]
  >,
  filters?: Omit<InvalidateQueryFilters, "queryKey" | "predicate" | "exact">,
): Promise<void> {
  return client.invalidateQueries({
    ...filters,
    queryKey: ["@novu/api", "retrieve", ...queryKeyBase],
  });
}

export function invalidateAllRetrieve(
  client: QueryClient,
  filters?: Omit<InvalidateQueryFilters, "queryKey" | "predicate" | "exact">,
): Promise<void> {
  return client.invalidateQueries({
    ...filters,
    queryKey: ["@novu/api", "retrieve"],
  });
}

export function buildRetrieveQuery(
  client$: NovuCore,
  request: operations.LogsControllerGetLogsRequest,
  options?: RequestOptions,
): {
  queryKey: QueryKey;
  queryFn: (context: QueryFunctionContext) => Promise<RetrieveQueryData>;
} {
  return {
    queryKey: queryKeyRetrieve({
      page: request.page,
      limit: request.limit,
      statusCodes: request.statusCodes,
      url: request.url,
      transactionId: request.transactionId,
      created: request.created,
      idempotencyKey: request.idempotencyKey,
    }),
    queryFn: async function retrieveQueryFn(ctx): Promise<RetrieveQueryData> {
      const sig = combineSignals(ctx.signal, options?.fetchOptions?.signal);
      const mergedOptions = {
        ...options,
        fetchOptions: { ...options?.fetchOptions, signal: sig },
      };

      return unwrapAsync(retrieve(
        client$,
        request,
        mergedOptions,
      ));
    },
  };
}

export function queryKeyRetrieve(
  parameters: {
    page?: number | undefined;
    limit?: number | undefined;
    statusCodes?: Array<number> | undefined;
    url?: string | undefined;
    transactionId?: string | undefined;
    created?: number | undefined;
    idempotencyKey?: string | undefined;
  },
): QueryKey {
  return ["@novu/api", "retrieve", parameters];
}
