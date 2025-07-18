/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";
import {
  collectExtraKeys as collectExtraKeys$,
  safeParse,
} from "../../lib/schemas.js";
import { ClosedEnum } from "../../types/enums.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";
import {
  DelayControlsMetadataResponseDto,
  DelayControlsMetadataResponseDto$inboundSchema,
  DelayControlsMetadataResponseDto$Outbound,
  DelayControlsMetadataResponseDto$outboundSchema,
} from "./delaycontrolsmetadataresponsedto.js";
import {
  ResourceOriginEnum,
  ResourceOriginEnum$inboundSchema,
  ResourceOriginEnum$outboundSchema,
} from "./resourceoriginenum.js";
import {
  StepIssuesDto,
  StepIssuesDto$inboundSchema,
  StepIssuesDto$Outbound,
  StepIssuesDto$outboundSchema,
} from "./stepissuesdto.js";
import {
  StepTypeEnum,
  StepTypeEnum$inboundSchema,
  StepTypeEnum$outboundSchema,
} from "./steptypeenum.js";

/**
 * Type of the delay. Currently only 'regular' is supported by the schema.
 */
export const DelayStepResponseDtoType = {
  Regular: "regular",
} as const;
/**
 * Type of the delay. Currently only 'regular' is supported by the schema.
 */
export type DelayStepResponseDtoType = ClosedEnum<
  typeof DelayStepResponseDtoType
>;

/**
 * Unit of time for the delay amount.
 */
export const DelayStepResponseDtoUnit = {
  Seconds: "seconds",
  Minutes: "minutes",
  Hours: "hours",
  Days: "days",
  Weeks: "weeks",
  Months: "months",
} as const;
/**
 * Unit of time for the delay amount.
 */
export type DelayStepResponseDtoUnit = ClosedEnum<
  typeof DelayStepResponseDtoUnit
>;

/**
 * Control values for the delay step
 */
export type DelayStepResponseDtoControlValues = {
  /**
   * JSONLogic filter conditions for conditionally skipping the step execution. Supports complex logical operations with AND, OR, and comparison operators. See https://jsonlogic.com/ for full typing reference.
   */
  skip?: { [k: string]: any } | undefined;
  /**
   * Type of the delay. Currently only 'regular' is supported by the schema.
   */
  type?: DelayStepResponseDtoType | undefined;
  /**
   * Amount of time to delay.
   */
  amount: number;
  /**
   * Unit of time for the delay amount.
   */
  unit: DelayStepResponseDtoUnit;
  additionalProperties?: { [k: string]: any };
};

export type DelayStepResponseDto = {
  /**
   * Controls metadata for the delay step
   */
  controls: DelayControlsMetadataResponseDto;
  /**
   * Control values for the delay step
   */
  controlValues?: DelayStepResponseDtoControlValues | undefined;
  /**
   * JSON Schema for variables, follows the JSON Schema standard
   */
  variables: { [k: string]: any };
  /**
   * Unique identifier of the step
   */
  stepId: string;
  /**
   * Database identifier of the step
   */
  id: string;
  /**
   * Name of the step
   */
  name: string;
  /**
   * Slug of the step
   */
  slug: string;
  /**
   * Type of the step
   */
  type: StepTypeEnum;
  /**
   * Origin of the workflow
   */
  origin: ResourceOriginEnum;
  /**
   * Workflow identifier
   */
  workflowId: string;
  /**
   * Workflow database identifier
   */
  workflowDatabaseId: string;
  /**
   * Issues associated with the step
   */
  issues?: StepIssuesDto | undefined;
};

/** @internal */
export const DelayStepResponseDtoType$inboundSchema: z.ZodNativeEnum<
  typeof DelayStepResponseDtoType
> = z.nativeEnum(DelayStepResponseDtoType);

/** @internal */
export const DelayStepResponseDtoType$outboundSchema: z.ZodNativeEnum<
  typeof DelayStepResponseDtoType
> = DelayStepResponseDtoType$inboundSchema;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace DelayStepResponseDtoType$ {
  /** @deprecated use `DelayStepResponseDtoType$inboundSchema` instead. */
  export const inboundSchema = DelayStepResponseDtoType$inboundSchema;
  /** @deprecated use `DelayStepResponseDtoType$outboundSchema` instead. */
  export const outboundSchema = DelayStepResponseDtoType$outboundSchema;
}

/** @internal */
export const DelayStepResponseDtoUnit$inboundSchema: z.ZodNativeEnum<
  typeof DelayStepResponseDtoUnit
> = z.nativeEnum(DelayStepResponseDtoUnit);

/** @internal */
export const DelayStepResponseDtoUnit$outboundSchema: z.ZodNativeEnum<
  typeof DelayStepResponseDtoUnit
> = DelayStepResponseDtoUnit$inboundSchema;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace DelayStepResponseDtoUnit$ {
  /** @deprecated use `DelayStepResponseDtoUnit$inboundSchema` instead. */
  export const inboundSchema = DelayStepResponseDtoUnit$inboundSchema;
  /** @deprecated use `DelayStepResponseDtoUnit$outboundSchema` instead. */
  export const outboundSchema = DelayStepResponseDtoUnit$outboundSchema;
}

/** @internal */
export const DelayStepResponseDtoControlValues$inboundSchema: z.ZodType<
  DelayStepResponseDtoControlValues,
  z.ZodTypeDef,
  unknown
> = collectExtraKeys$(
  z.object({
    skip: z.record(z.any()).optional(),
    type: DelayStepResponseDtoType$inboundSchema.default("regular"),
    amount: z.number(),
    unit: DelayStepResponseDtoUnit$inboundSchema,
  }).catchall(z.any()),
  "additionalProperties",
  true,
);

/** @internal */
export type DelayStepResponseDtoControlValues$Outbound = {
  skip?: { [k: string]: any } | undefined;
  type: string;
  amount: number;
  unit: string;
  [additionalProperties: string]: unknown;
};

/** @internal */
export const DelayStepResponseDtoControlValues$outboundSchema: z.ZodType<
  DelayStepResponseDtoControlValues$Outbound,
  z.ZodTypeDef,
  DelayStepResponseDtoControlValues
> = z.object({
  skip: z.record(z.any()).optional(),
  type: DelayStepResponseDtoType$outboundSchema.default("regular"),
  amount: z.number(),
  unit: DelayStepResponseDtoUnit$outboundSchema,
  additionalProperties: z.record(z.any()),
}).transform((v) => {
  return {
    ...v.additionalProperties,
    ...remap$(v, {
      additionalProperties: null,
    }),
  };
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace DelayStepResponseDtoControlValues$ {
  /** @deprecated use `DelayStepResponseDtoControlValues$inboundSchema` instead. */
  export const inboundSchema = DelayStepResponseDtoControlValues$inboundSchema;
  /** @deprecated use `DelayStepResponseDtoControlValues$outboundSchema` instead. */
  export const outboundSchema =
    DelayStepResponseDtoControlValues$outboundSchema;
  /** @deprecated use `DelayStepResponseDtoControlValues$Outbound` instead. */
  export type Outbound = DelayStepResponseDtoControlValues$Outbound;
}

export function delayStepResponseDtoControlValuesToJSON(
  delayStepResponseDtoControlValues: DelayStepResponseDtoControlValues,
): string {
  return JSON.stringify(
    DelayStepResponseDtoControlValues$outboundSchema.parse(
      delayStepResponseDtoControlValues,
    ),
  );
}

export function delayStepResponseDtoControlValuesFromJSON(
  jsonString: string,
): SafeParseResult<DelayStepResponseDtoControlValues, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => DelayStepResponseDtoControlValues$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'DelayStepResponseDtoControlValues' from JSON`,
  );
}

/** @internal */
export const DelayStepResponseDto$inboundSchema: z.ZodType<
  DelayStepResponseDto,
  z.ZodTypeDef,
  unknown
> = z.object({
  controls: DelayControlsMetadataResponseDto$inboundSchema,
  controlValues: z.lazy(() => DelayStepResponseDtoControlValues$inboundSchema)
    .optional(),
  variables: z.record(z.any()),
  stepId: z.string(),
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: StepTypeEnum$inboundSchema,
  origin: ResourceOriginEnum$inboundSchema,
  workflowId: z.string(),
  workflowDatabaseId: z.string(),
  issues: StepIssuesDto$inboundSchema.optional(),
}).transform((v) => {
  return remap$(v, {
    "_id": "id",
  });
});

/** @internal */
export type DelayStepResponseDto$Outbound = {
  controls: DelayControlsMetadataResponseDto$Outbound;
  controlValues?: DelayStepResponseDtoControlValues$Outbound | undefined;
  variables: { [k: string]: any };
  stepId: string;
  _id: string;
  name: string;
  slug: string;
  type: string;
  origin: string;
  workflowId: string;
  workflowDatabaseId: string;
  issues?: StepIssuesDto$Outbound | undefined;
};

/** @internal */
export const DelayStepResponseDto$outboundSchema: z.ZodType<
  DelayStepResponseDto$Outbound,
  z.ZodTypeDef,
  DelayStepResponseDto
> = z.object({
  controls: DelayControlsMetadataResponseDto$outboundSchema,
  controlValues: z.lazy(() => DelayStepResponseDtoControlValues$outboundSchema)
    .optional(),
  variables: z.record(z.any()),
  stepId: z.string(),
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: StepTypeEnum$outboundSchema,
  origin: ResourceOriginEnum$outboundSchema,
  workflowId: z.string(),
  workflowDatabaseId: z.string(),
  issues: StepIssuesDto$outboundSchema.optional(),
}).transform((v) => {
  return remap$(v, {
    id: "_id",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace DelayStepResponseDto$ {
  /** @deprecated use `DelayStepResponseDto$inboundSchema` instead. */
  export const inboundSchema = DelayStepResponseDto$inboundSchema;
  /** @deprecated use `DelayStepResponseDto$outboundSchema` instead. */
  export const outboundSchema = DelayStepResponseDto$outboundSchema;
  /** @deprecated use `DelayStepResponseDto$Outbound` instead. */
  export type Outbound = DelayStepResponseDto$Outbound;
}

export function delayStepResponseDtoToJSON(
  delayStepResponseDto: DelayStepResponseDto,
): string {
  return JSON.stringify(
    DelayStepResponseDto$outboundSchema.parse(delayStepResponseDto),
  );
}

export function delayStepResponseDtoFromJSON(
  jsonString: string,
): SafeParseResult<DelayStepResponseDto, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => DelayStepResponseDto$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'DelayStepResponseDto' from JSON`,
  );
}
