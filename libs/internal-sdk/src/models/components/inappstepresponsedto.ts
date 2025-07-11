/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";
import {
  collectExtraKeys as collectExtraKeys$,
  safeParse,
} from "../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";
import {
  ActionDto,
  ActionDto$inboundSchema,
  ActionDto$Outbound,
  ActionDto$outboundSchema,
} from "./actiondto.js";
import {
  InAppControlsMetadataResponseDto,
  InAppControlsMetadataResponseDto$inboundSchema,
  InAppControlsMetadataResponseDto$Outbound,
  InAppControlsMetadataResponseDto$outboundSchema,
} from "./inappcontrolsmetadataresponsedto.js";
import {
  RedirectDto,
  RedirectDto$inboundSchema,
  RedirectDto$Outbound,
  RedirectDto$outboundSchema,
} from "./redirectdto.js";
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
 * Control values for the in-app step
 */
export type InAppStepResponseDtoControlValues = {
  /**
   * JSONLogic filter conditions for conditionally skipping the step execution. Supports complex logical operations with AND, OR, and comparison operators. See https://jsonlogic.com/ for full typing reference.
   */
  skip?: { [k: string]: any } | undefined;
  /**
   * Content/body of the in-app message. Required if subject is empty.
   */
  body?: string | undefined;
  /**
   * Subject/title of the in-app message. Required if body is empty.
   */
  subject?: string | undefined;
  /**
   * URL for an avatar image. Must be a valid URL or start with / or {{"{{"}} variable }}.
   */
  avatar?: string | undefined;
  /**
   * Primary action button details.
   */
  primaryAction?: ActionDto | undefined;
  /**
   * Secondary action button details.
   */
  secondaryAction?: ActionDto | undefined;
  /**
   * Redirection URL configuration for the main content click (if no actions defined/clicked)..
   */
  redirect?: RedirectDto | undefined;
  /**
   * Disable sanitization of the output.
   */
  disableOutputSanitization?: boolean | undefined;
  /**
   * Additional data payload for the step.
   */
  data?: { [k: string]: any } | undefined;
  additionalProperties?: { [k: string]: any };
};

export type InAppStepResponseDto = {
  /**
   * Controls metadata for the in-app step
   */
  controls: InAppControlsMetadataResponseDto;
  /**
   * Control values for the in-app step
   */
  controlValues?: InAppStepResponseDtoControlValues | undefined;
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
export const InAppStepResponseDtoControlValues$inboundSchema: z.ZodType<
  InAppStepResponseDtoControlValues,
  z.ZodTypeDef,
  unknown
> = collectExtraKeys$(
  z.object({
    skip: z.record(z.any()).optional(),
    body: z.string().optional(),
    subject: z.string().optional(),
    avatar: z.string().optional(),
    primaryAction: ActionDto$inboundSchema.optional(),
    secondaryAction: ActionDto$inboundSchema.optional(),
    redirect: RedirectDto$inboundSchema.optional(),
    disableOutputSanitization: z.boolean().default(false),
    data: z.record(z.any()).optional(),
  }).catchall(z.any()),
  "additionalProperties",
  true,
);

/** @internal */
export type InAppStepResponseDtoControlValues$Outbound = {
  skip?: { [k: string]: any } | undefined;
  body?: string | undefined;
  subject?: string | undefined;
  avatar?: string | undefined;
  primaryAction?: ActionDto$Outbound | undefined;
  secondaryAction?: ActionDto$Outbound | undefined;
  redirect?: RedirectDto$Outbound | undefined;
  disableOutputSanitization: boolean;
  data?: { [k: string]: any } | undefined;
  [additionalProperties: string]: unknown;
};

/** @internal */
export const InAppStepResponseDtoControlValues$outboundSchema: z.ZodType<
  InAppStepResponseDtoControlValues$Outbound,
  z.ZodTypeDef,
  InAppStepResponseDtoControlValues
> = z.object({
  skip: z.record(z.any()).optional(),
  body: z.string().optional(),
  subject: z.string().optional(),
  avatar: z.string().optional(),
  primaryAction: ActionDto$outboundSchema.optional(),
  secondaryAction: ActionDto$outboundSchema.optional(),
  redirect: RedirectDto$outboundSchema.optional(),
  disableOutputSanitization: z.boolean().default(false),
  data: z.record(z.any()).optional(),
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
export namespace InAppStepResponseDtoControlValues$ {
  /** @deprecated use `InAppStepResponseDtoControlValues$inboundSchema` instead. */
  export const inboundSchema = InAppStepResponseDtoControlValues$inboundSchema;
  /** @deprecated use `InAppStepResponseDtoControlValues$outboundSchema` instead. */
  export const outboundSchema =
    InAppStepResponseDtoControlValues$outboundSchema;
  /** @deprecated use `InAppStepResponseDtoControlValues$Outbound` instead. */
  export type Outbound = InAppStepResponseDtoControlValues$Outbound;
}

export function inAppStepResponseDtoControlValuesToJSON(
  inAppStepResponseDtoControlValues: InAppStepResponseDtoControlValues,
): string {
  return JSON.stringify(
    InAppStepResponseDtoControlValues$outboundSchema.parse(
      inAppStepResponseDtoControlValues,
    ),
  );
}

export function inAppStepResponseDtoControlValuesFromJSON(
  jsonString: string,
): SafeParseResult<InAppStepResponseDtoControlValues, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => InAppStepResponseDtoControlValues$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'InAppStepResponseDtoControlValues' from JSON`,
  );
}

/** @internal */
export const InAppStepResponseDto$inboundSchema: z.ZodType<
  InAppStepResponseDto,
  z.ZodTypeDef,
  unknown
> = z.object({
  controls: InAppControlsMetadataResponseDto$inboundSchema,
  controlValues: z.lazy(() => InAppStepResponseDtoControlValues$inboundSchema)
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
export type InAppStepResponseDto$Outbound = {
  controls: InAppControlsMetadataResponseDto$Outbound;
  controlValues?: InAppStepResponseDtoControlValues$Outbound | undefined;
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
export const InAppStepResponseDto$outboundSchema: z.ZodType<
  InAppStepResponseDto$Outbound,
  z.ZodTypeDef,
  InAppStepResponseDto
> = z.object({
  controls: InAppControlsMetadataResponseDto$outboundSchema,
  controlValues: z.lazy(() => InAppStepResponseDtoControlValues$outboundSchema)
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
export namespace InAppStepResponseDto$ {
  /** @deprecated use `InAppStepResponseDto$inboundSchema` instead. */
  export const inboundSchema = InAppStepResponseDto$inboundSchema;
  /** @deprecated use `InAppStepResponseDto$outboundSchema` instead. */
  export const outboundSchema = InAppStepResponseDto$outboundSchema;
  /** @deprecated use `InAppStepResponseDto$Outbound` instead. */
  export type Outbound = InAppStepResponseDto$Outbound;
}

export function inAppStepResponseDtoToJSON(
  inAppStepResponseDto: InAppStepResponseDto,
): string {
  return JSON.stringify(
    InAppStepResponseDto$outboundSchema.parse(inAppStepResponseDto),
  );
}

export function inAppStepResponseDtoFromJSON(
  jsonString: string,
): SafeParseResult<InAppStepResponseDto, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => InAppStepResponseDto$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'InAppStepResponseDto' from JSON`,
  );
}
