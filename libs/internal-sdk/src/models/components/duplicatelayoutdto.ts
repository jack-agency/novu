/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { safeParse } from "../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";

export type DuplicateLayoutDto = {
  /**
   * Name of the layout
   */
  name: string;
};

/** @internal */
export const DuplicateLayoutDto$inboundSchema: z.ZodType<
  DuplicateLayoutDto,
  z.ZodTypeDef,
  unknown
> = z.object({
  name: z.string(),
});

/** @internal */
export type DuplicateLayoutDto$Outbound = {
  name: string;
};

/** @internal */
export const DuplicateLayoutDto$outboundSchema: z.ZodType<
  DuplicateLayoutDto$Outbound,
  z.ZodTypeDef,
  DuplicateLayoutDto
> = z.object({
  name: z.string(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace DuplicateLayoutDto$ {
  /** @deprecated use `DuplicateLayoutDto$inboundSchema` instead. */
  export const inboundSchema = DuplicateLayoutDto$inboundSchema;
  /** @deprecated use `DuplicateLayoutDto$outboundSchema` instead. */
  export const outboundSchema = DuplicateLayoutDto$outboundSchema;
  /** @deprecated use `DuplicateLayoutDto$Outbound` instead. */
  export type Outbound = DuplicateLayoutDto$Outbound;
}

export function duplicateLayoutDtoToJSON(
  duplicateLayoutDto: DuplicateLayoutDto,
): string {
  return JSON.stringify(
    DuplicateLayoutDto$outboundSchema.parse(duplicateLayoutDto),
  );
}

export function duplicateLayoutDtoFromJSON(
  jsonString: string,
): SafeParseResult<DuplicateLayoutDto, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => DuplicateLayoutDto$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'DuplicateLayoutDto' from JSON`,
  );
}
