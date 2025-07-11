/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { safeParse } from "../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";

export type PatchWorkflowDto = {
  /**
   * Activate or deactivate the workflow
   */
  active?: boolean | undefined;
  /**
   * New name for the workflow
   */
  name?: string | undefined;
  /**
   * Updated description of the workflow
   */
  description?: string | undefined;
  /**
   * Tags associated with the workflow
   */
  tags?: Array<string> | undefined;
  /**
   * The payload JSON Schema for the workflow
   */
  payloadSchema?: { [k: string]: any } | undefined;
  /**
   * Enable or disable payload schema validation
   */
  validatePayload?: boolean | undefined;
  /**
   * Enable or disable translations for this workflow
   */
  isTranslationEnabled?: boolean | undefined;
};

/** @internal */
export const PatchWorkflowDto$inboundSchema: z.ZodType<
  PatchWorkflowDto,
  z.ZodTypeDef,
  unknown
> = z.object({
  active: z.boolean().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  payloadSchema: z.record(z.any()).optional(),
  validatePayload: z.boolean().optional(),
  isTranslationEnabled: z.boolean().optional(),
});

/** @internal */
export type PatchWorkflowDto$Outbound = {
  active?: boolean | undefined;
  name?: string | undefined;
  description?: string | undefined;
  tags?: Array<string> | undefined;
  payloadSchema?: { [k: string]: any } | undefined;
  validatePayload?: boolean | undefined;
  isTranslationEnabled?: boolean | undefined;
};

/** @internal */
export const PatchWorkflowDto$outboundSchema: z.ZodType<
  PatchWorkflowDto$Outbound,
  z.ZodTypeDef,
  PatchWorkflowDto
> = z.object({
  active: z.boolean().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  payloadSchema: z.record(z.any()).optional(),
  validatePayload: z.boolean().optional(),
  isTranslationEnabled: z.boolean().optional(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace PatchWorkflowDto$ {
  /** @deprecated use `PatchWorkflowDto$inboundSchema` instead. */
  export const inboundSchema = PatchWorkflowDto$inboundSchema;
  /** @deprecated use `PatchWorkflowDto$outboundSchema` instead. */
  export const outboundSchema = PatchWorkflowDto$outboundSchema;
  /** @deprecated use `PatchWorkflowDto$Outbound` instead. */
  export type Outbound = PatchWorkflowDto$Outbound;
}

export function patchWorkflowDtoToJSON(
  patchWorkflowDto: PatchWorkflowDto,
): string {
  return JSON.stringify(
    PatchWorkflowDto$outboundSchema.parse(patchWorkflowDto),
  );
}

export function patchWorkflowDtoFromJSON(
  jsonString: string,
): SafeParseResult<PatchWorkflowDto, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => PatchWorkflowDto$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'PatchWorkflowDto' from JSON`,
  );
}
