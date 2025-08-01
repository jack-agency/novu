/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";
import { safeParse } from "../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import * as components from "../components/index.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";

export type WorkflowControllerSearchWorkflowsRequest = {
  /**
   * Number of items to return per page
   */
  limit?: number | undefined;
  /**
   * Number of items to skip before starting to return results
   */
  offset?: number | undefined;
  /**
   * Direction of sorting
   */
  orderDirection?: components.DirectionEnum | undefined;
  /**
   * Field to sort the results by
   */
  orderBy?: components.WorkflowResponseDtoSortField | undefined;
  /**
   * Search query to filter workflows
   */
  query?: string | undefined;
  /**
   * Filter workflows by tags
   */
  tags?: Array<string> | undefined;
  /**
   * Filter workflows by status
   */
  status?: Array<components.WorkflowStatusEnum> | undefined;
  /**
   * A header for idempotency purposes
   */
  idempotencyKey?: string | undefined;
};

export type WorkflowControllerSearchWorkflowsResponse = {
  headers: { [k: string]: Array<string> };
  result: components.ListWorkflowResponse;
};

/** @internal */
export const WorkflowControllerSearchWorkflowsRequest$inboundSchema: z.ZodType<
  WorkflowControllerSearchWorkflowsRequest,
  z.ZodTypeDef,
  unknown
> = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  orderDirection: components.DirectionEnum$inboundSchema.optional(),
  orderBy: components.WorkflowResponseDtoSortField$inboundSchema.optional(),
  query: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.array(components.WorkflowStatusEnum$inboundSchema).optional(),
  "idempotency-key": z.string().optional(),
}).transform((v) => {
  return remap$(v, {
    "idempotency-key": "idempotencyKey",
  });
});

/** @internal */
export type WorkflowControllerSearchWorkflowsRequest$Outbound = {
  limit?: number | undefined;
  offset?: number | undefined;
  orderDirection?: string | undefined;
  orderBy?: string | undefined;
  query?: string | undefined;
  tags?: Array<string> | undefined;
  status?: Array<string> | undefined;
  "idempotency-key"?: string | undefined;
};

/** @internal */
export const WorkflowControllerSearchWorkflowsRequest$outboundSchema: z.ZodType<
  WorkflowControllerSearchWorkflowsRequest$Outbound,
  z.ZodTypeDef,
  WorkflowControllerSearchWorkflowsRequest
> = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  orderDirection: components.DirectionEnum$outboundSchema.optional(),
  orderBy: components.WorkflowResponseDtoSortField$outboundSchema.optional(),
  query: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.array(components.WorkflowStatusEnum$outboundSchema).optional(),
  idempotencyKey: z.string().optional(),
}).transform((v) => {
  return remap$(v, {
    idempotencyKey: "idempotency-key",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace WorkflowControllerSearchWorkflowsRequest$ {
  /** @deprecated use `WorkflowControllerSearchWorkflowsRequest$inboundSchema` instead. */
  export const inboundSchema =
    WorkflowControllerSearchWorkflowsRequest$inboundSchema;
  /** @deprecated use `WorkflowControllerSearchWorkflowsRequest$outboundSchema` instead. */
  export const outboundSchema =
    WorkflowControllerSearchWorkflowsRequest$outboundSchema;
  /** @deprecated use `WorkflowControllerSearchWorkflowsRequest$Outbound` instead. */
  export type Outbound = WorkflowControllerSearchWorkflowsRequest$Outbound;
}

export function workflowControllerSearchWorkflowsRequestToJSON(
  workflowControllerSearchWorkflowsRequest:
    WorkflowControllerSearchWorkflowsRequest,
): string {
  return JSON.stringify(
    WorkflowControllerSearchWorkflowsRequest$outboundSchema.parse(
      workflowControllerSearchWorkflowsRequest,
    ),
  );
}

export function workflowControllerSearchWorkflowsRequestFromJSON(
  jsonString: string,
): SafeParseResult<
  WorkflowControllerSearchWorkflowsRequest,
  SDKValidationError
> {
  return safeParse(
    jsonString,
    (x) =>
      WorkflowControllerSearchWorkflowsRequest$inboundSchema.parse(
        JSON.parse(x),
      ),
    `Failed to parse 'WorkflowControllerSearchWorkflowsRequest' from JSON`,
  );
}

/** @internal */
export const WorkflowControllerSearchWorkflowsResponse$inboundSchema: z.ZodType<
  WorkflowControllerSearchWorkflowsResponse,
  z.ZodTypeDef,
  unknown
> = z.object({
  Headers: z.record(z.array(z.string())),
  Result: components.ListWorkflowResponse$inboundSchema,
}).transform((v) => {
  return remap$(v, {
    "Headers": "headers",
    "Result": "result",
  });
});

/** @internal */
export type WorkflowControllerSearchWorkflowsResponse$Outbound = {
  Headers: { [k: string]: Array<string> };
  Result: components.ListWorkflowResponse$Outbound;
};

/** @internal */
export const WorkflowControllerSearchWorkflowsResponse$outboundSchema:
  z.ZodType<
    WorkflowControllerSearchWorkflowsResponse$Outbound,
    z.ZodTypeDef,
    WorkflowControllerSearchWorkflowsResponse
  > = z.object({
    headers: z.record(z.array(z.string())),
    result: components.ListWorkflowResponse$outboundSchema,
  }).transform((v) => {
    return remap$(v, {
      headers: "Headers",
      result: "Result",
    });
  });

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace WorkflowControllerSearchWorkflowsResponse$ {
  /** @deprecated use `WorkflowControllerSearchWorkflowsResponse$inboundSchema` instead. */
  export const inboundSchema =
    WorkflowControllerSearchWorkflowsResponse$inboundSchema;
  /** @deprecated use `WorkflowControllerSearchWorkflowsResponse$outboundSchema` instead. */
  export const outboundSchema =
    WorkflowControllerSearchWorkflowsResponse$outboundSchema;
  /** @deprecated use `WorkflowControllerSearchWorkflowsResponse$Outbound` instead. */
  export type Outbound = WorkflowControllerSearchWorkflowsResponse$Outbound;
}

export function workflowControllerSearchWorkflowsResponseToJSON(
  workflowControllerSearchWorkflowsResponse:
    WorkflowControllerSearchWorkflowsResponse,
): string {
  return JSON.stringify(
    WorkflowControllerSearchWorkflowsResponse$outboundSchema.parse(
      workflowControllerSearchWorkflowsResponse,
    ),
  );
}

export function workflowControllerSearchWorkflowsResponseFromJSON(
  jsonString: string,
): SafeParseResult<
  WorkflowControllerSearchWorkflowsResponse,
  SDKValidationError
> {
  return safeParse(
    jsonString,
    (x) =>
      WorkflowControllerSearchWorkflowsResponse$inboundSchema.parse(
        JSON.parse(x),
      ),
    `Failed to parse 'WorkflowControllerSearchWorkflowsResponse' from JSON`,
  );
}
