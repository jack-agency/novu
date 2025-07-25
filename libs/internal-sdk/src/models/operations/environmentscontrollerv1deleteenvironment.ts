/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";
import { safeParse } from "../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";

export type EnvironmentsControllerV1DeleteEnvironmentRequest = {
  /**
   * The unique identifier of the environment
   */
  environmentId: string;
  /**
   * A header for idempotency purposes
   */
  idempotencyKey?: string | undefined;
};

export type EnvironmentsControllerV1DeleteEnvironmentResponse = {
  headers: { [k: string]: Array<string> };
};

/** @internal */
export const EnvironmentsControllerV1DeleteEnvironmentRequest$inboundSchema:
  z.ZodType<
    EnvironmentsControllerV1DeleteEnvironmentRequest,
    z.ZodTypeDef,
    unknown
  > = z.object({
    environmentId: z.string(),
    "idempotency-key": z.string().optional(),
  }).transform((v) => {
    return remap$(v, {
      "idempotency-key": "idempotencyKey",
    });
  });

/** @internal */
export type EnvironmentsControllerV1DeleteEnvironmentRequest$Outbound = {
  environmentId: string;
  "idempotency-key"?: string | undefined;
};

/** @internal */
export const EnvironmentsControllerV1DeleteEnvironmentRequest$outboundSchema:
  z.ZodType<
    EnvironmentsControllerV1DeleteEnvironmentRequest$Outbound,
    z.ZodTypeDef,
    EnvironmentsControllerV1DeleteEnvironmentRequest
  > = z.object({
    environmentId: z.string(),
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
export namespace EnvironmentsControllerV1DeleteEnvironmentRequest$ {
  /** @deprecated use `EnvironmentsControllerV1DeleteEnvironmentRequest$inboundSchema` instead. */
  export const inboundSchema =
    EnvironmentsControllerV1DeleteEnvironmentRequest$inboundSchema;
  /** @deprecated use `EnvironmentsControllerV1DeleteEnvironmentRequest$outboundSchema` instead. */
  export const outboundSchema =
    EnvironmentsControllerV1DeleteEnvironmentRequest$outboundSchema;
  /** @deprecated use `EnvironmentsControllerV1DeleteEnvironmentRequest$Outbound` instead. */
  export type Outbound =
    EnvironmentsControllerV1DeleteEnvironmentRequest$Outbound;
}

export function environmentsControllerV1DeleteEnvironmentRequestToJSON(
  environmentsControllerV1DeleteEnvironmentRequest:
    EnvironmentsControllerV1DeleteEnvironmentRequest,
): string {
  return JSON.stringify(
    EnvironmentsControllerV1DeleteEnvironmentRequest$outboundSchema.parse(
      environmentsControllerV1DeleteEnvironmentRequest,
    ),
  );
}

export function environmentsControllerV1DeleteEnvironmentRequestFromJSON(
  jsonString: string,
): SafeParseResult<
  EnvironmentsControllerV1DeleteEnvironmentRequest,
  SDKValidationError
> {
  return safeParse(
    jsonString,
    (x) =>
      EnvironmentsControllerV1DeleteEnvironmentRequest$inboundSchema.parse(
        JSON.parse(x),
      ),
    `Failed to parse 'EnvironmentsControllerV1DeleteEnvironmentRequest' from JSON`,
  );
}

/** @internal */
export const EnvironmentsControllerV1DeleteEnvironmentResponse$inboundSchema:
  z.ZodType<
    EnvironmentsControllerV1DeleteEnvironmentResponse,
    z.ZodTypeDef,
    unknown
  > = z.object({
    Headers: z.record(z.array(z.string())),
  }).transform((v) => {
    return remap$(v, {
      "Headers": "headers",
    });
  });

/** @internal */
export type EnvironmentsControllerV1DeleteEnvironmentResponse$Outbound = {
  Headers: { [k: string]: Array<string> };
};

/** @internal */
export const EnvironmentsControllerV1DeleteEnvironmentResponse$outboundSchema:
  z.ZodType<
    EnvironmentsControllerV1DeleteEnvironmentResponse$Outbound,
    z.ZodTypeDef,
    EnvironmentsControllerV1DeleteEnvironmentResponse
  > = z.object({
    headers: z.record(z.array(z.string())),
  }).transform((v) => {
    return remap$(v, {
      headers: "Headers",
    });
  });

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace EnvironmentsControllerV1DeleteEnvironmentResponse$ {
  /** @deprecated use `EnvironmentsControllerV1DeleteEnvironmentResponse$inboundSchema` instead. */
  export const inboundSchema =
    EnvironmentsControllerV1DeleteEnvironmentResponse$inboundSchema;
  /** @deprecated use `EnvironmentsControllerV1DeleteEnvironmentResponse$outboundSchema` instead. */
  export const outboundSchema =
    EnvironmentsControllerV1DeleteEnvironmentResponse$outboundSchema;
  /** @deprecated use `EnvironmentsControllerV1DeleteEnvironmentResponse$Outbound` instead. */
  export type Outbound =
    EnvironmentsControllerV1DeleteEnvironmentResponse$Outbound;
}

export function environmentsControllerV1DeleteEnvironmentResponseToJSON(
  environmentsControllerV1DeleteEnvironmentResponse:
    EnvironmentsControllerV1DeleteEnvironmentResponse,
): string {
  return JSON.stringify(
    EnvironmentsControllerV1DeleteEnvironmentResponse$outboundSchema.parse(
      environmentsControllerV1DeleteEnvironmentResponse,
    ),
  );
}

export function environmentsControllerV1DeleteEnvironmentResponseFromJSON(
  jsonString: string,
): SafeParseResult<
  EnvironmentsControllerV1DeleteEnvironmentResponse,
  SDKValidationError
> {
  return safeParse(
    jsonString,
    (x) =>
      EnvironmentsControllerV1DeleteEnvironmentResponse$inboundSchema.parse(
        JSON.parse(x),
      ),
    `Failed to parse 'EnvironmentsControllerV1DeleteEnvironmentResponse' from JSON`,
  );
}
