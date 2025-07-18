/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { ClosedEnum } from "../../types/enums.js";

/**
 * Type of the layout
 */
export const ResourceTypeEnum = {
  Regular: "REGULAR",
  Echo: "ECHO",
  Bridge: "BRIDGE",
} as const;
/**
 * Type of the layout
 */
export type ResourceTypeEnum = ClosedEnum<typeof ResourceTypeEnum>;

/** @internal */
export const ResourceTypeEnum$inboundSchema: z.ZodNativeEnum<
  typeof ResourceTypeEnum
> = z.nativeEnum(ResourceTypeEnum);

/** @internal */
export const ResourceTypeEnum$outboundSchema: z.ZodNativeEnum<
  typeof ResourceTypeEnum
> = ResourceTypeEnum$inboundSchema;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace ResourceTypeEnum$ {
  /** @deprecated use `ResourceTypeEnum$inboundSchema` instead. */
  export const inboundSchema = ResourceTypeEnum$inboundSchema;
  /** @deprecated use `ResourceTypeEnum$outboundSchema` instead. */
  export const outboundSchema = ResourceTypeEnum$outboundSchema;
}
