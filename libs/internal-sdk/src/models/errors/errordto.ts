/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { safeParse } from "../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { NovuError } from "./novuerror.js";
import { SDKValidationError } from "./sdkvalidationerror.js";

export type Five = string | number | boolean | { [k: string]: any };

export type Four = {};

/**
 * Value that failed validation
 */
export type Message =
  | Four
  | string
  | number
  | boolean
  | Array<string | number | boolean | { [k: string]: any } | null>;

export type ErrorDtoData = {
  /**
   * HTTP status code of the error response.
   */
  statusCode: number;
  /**
   * Timestamp of when the error occurred.
   */
  timestamp: string;
  /**
   * The path where the error occurred.
   */
  path: string;
  /**
   * Value that failed validation
   */
  message?:
    | Four
    | string
    | number
    | boolean
    | Array<string | number | boolean | { [k: string]: any } | null>
    | null
    | undefined;
  /**
   * Optional context object for additional error details.
   */
  ctx?: { [k: string]: any } | undefined;
  /**
   * Optional unique identifier for the error, useful for tracking using Sentry and
   *
   * @remarks
   *       New Relic, only available for 500.
   */
  errorId?: string | undefined;
};

export class ErrorDto extends NovuError {
  /**
   * Timestamp of when the error occurred.
   */
  timestamp: string;
  /**
   * The path where the error occurred.
   */
  path: string;
  /**
   * Optional context object for additional error details.
   */
  ctx?: { [k: string]: any } | undefined;
  /**
   * Optional unique identifier for the error, useful for tracking using Sentry and
   *
   * @remarks
   *       New Relic, only available for 500.
   */
  errorId?: string | undefined;

  /** The original data that was passed to this error instance. */
  data$: ErrorDtoData;

  constructor(
    err: ErrorDtoData,
    httpMeta: { response: Response; request: Request; body: string },
  ) {
    const message = "message" in err && typeof err.message === "string"
      ? err.message
      : `API error occurred: ${JSON.stringify(err)}`;
    super(message, httpMeta);
    this.data$ = err;
    this.timestamp = err.timestamp;
    this.path = err.path;
    if (err.ctx != null) this.ctx = err.ctx;
    if (err.errorId != null) this.errorId = err.errorId;

    this.name = "ErrorDto";
  }
}

/** @internal */
export const Five$inboundSchema: z.ZodType<Five, z.ZodTypeDef, unknown> = z
  .union([z.string(), z.number(), z.boolean(), z.record(z.any())]);

/** @internal */
export type Five$Outbound = string | number | boolean | { [k: string]: any };

/** @internal */
export const Five$outboundSchema: z.ZodType<Five$Outbound, z.ZodTypeDef, Five> =
  z.union([z.string(), z.number(), z.boolean(), z.record(z.any())]);

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Five$ {
  /** @deprecated use `Five$inboundSchema` instead. */
  export const inboundSchema = Five$inboundSchema;
  /** @deprecated use `Five$outboundSchema` instead. */
  export const outboundSchema = Five$outboundSchema;
  /** @deprecated use `Five$Outbound` instead. */
  export type Outbound = Five$Outbound;
}

export function fiveToJSON(five: Five): string {
  return JSON.stringify(Five$outboundSchema.parse(five));
}

export function fiveFromJSON(
  jsonString: string,
): SafeParseResult<Five, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => Five$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'Five' from JSON`,
  );
}

/** @internal */
export const Four$inboundSchema: z.ZodType<Four, z.ZodTypeDef, unknown> = z
  .object({});

/** @internal */
export type Four$Outbound = {};

/** @internal */
export const Four$outboundSchema: z.ZodType<Four$Outbound, z.ZodTypeDef, Four> =
  z.object({});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Four$ {
  /** @deprecated use `Four$inboundSchema` instead. */
  export const inboundSchema = Four$inboundSchema;
  /** @deprecated use `Four$outboundSchema` instead. */
  export const outboundSchema = Four$outboundSchema;
  /** @deprecated use `Four$Outbound` instead. */
  export type Outbound = Four$Outbound;
}

export function fourToJSON(four: Four): string {
  return JSON.stringify(Four$outboundSchema.parse(four));
}

export function fourFromJSON(
  jsonString: string,
): SafeParseResult<Four, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => Four$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'Four' from JSON`,
  );
}

/** @internal */
export const Message$inboundSchema: z.ZodType<Message, z.ZodTypeDef, unknown> =
  z.union([
    z.lazy(() => Four$inboundSchema),
    z.string(),
    z.number(),
    z.boolean(),
    z.array(
      z.nullable(
        z.union([z.string(), z.number(), z.boolean(), z.record(z.any())]),
      ),
    ),
  ]);

/** @internal */
export type Message$Outbound =
  | Four$Outbound
  | string
  | number
  | boolean
  | Array<string | number | boolean | { [k: string]: any } | null>;

/** @internal */
export const Message$outboundSchema: z.ZodType<
  Message$Outbound,
  z.ZodTypeDef,
  Message
> = z.union([
  z.lazy(() => Four$outboundSchema),
  z.string(),
  z.number(),
  z.boolean(),
  z.array(
    z.nullable(
      z.union([z.string(), z.number(), z.boolean(), z.record(z.any())]),
    ),
  ),
]);

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Message$ {
  /** @deprecated use `Message$inboundSchema` instead. */
  export const inboundSchema = Message$inboundSchema;
  /** @deprecated use `Message$outboundSchema` instead. */
  export const outboundSchema = Message$outboundSchema;
  /** @deprecated use `Message$Outbound` instead. */
  export type Outbound = Message$Outbound;
}

export function messageToJSON(message: Message): string {
  return JSON.stringify(Message$outboundSchema.parse(message));
}

export function messageFromJSON(
  jsonString: string,
): SafeParseResult<Message, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => Message$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'Message' from JSON`,
  );
}

/** @internal */
export const ErrorDto$inboundSchema: z.ZodType<
  ErrorDto,
  z.ZodTypeDef,
  unknown
> = z.object({
  statusCode: z.number(),
  timestamp: z.string(),
  path: z.string(),
  message: z.nullable(
    z.union([
      z.lazy(() => Four$inboundSchema),
      z.string(),
      z.number(),
      z.boolean(),
      z.array(
        z.nullable(
          z.union([z.string(), z.number(), z.boolean(), z.record(z.any())]),
        ),
      ),
    ]),
  ).optional(),
  ctx: z.record(z.any()).optional(),
  errorId: z.string().optional(),
  request$: z.instanceof(Request),
  response$: z.instanceof(Response),
  body$: z.string(),
})
  .transform((v) => {
    return new ErrorDto(v, {
      request: v.request$,
      response: v.response$,
      body: v.body$,
    });
  });

/** @internal */
export type ErrorDto$Outbound = {
  statusCode: number;
  timestamp: string;
  path: string;
  message?:
    | Four$Outbound
    | string
    | number
    | boolean
    | Array<string | number | boolean | { [k: string]: any } | null>
    | null
    | undefined;
  ctx?: { [k: string]: any } | undefined;
  errorId?: string | undefined;
};

/** @internal */
export const ErrorDto$outboundSchema: z.ZodType<
  ErrorDto$Outbound,
  z.ZodTypeDef,
  ErrorDto
> = z.instanceof(ErrorDto)
  .transform(v => v.data$)
  .pipe(z.object({
    statusCode: z.number(),
    timestamp: z.string(),
    path: z.string(),
    message: z.nullable(
      z.union([
        z.lazy(() => Four$outboundSchema),
        z.string(),
        z.number(),
        z.boolean(),
        z.array(
          z.nullable(
            z.union([z.string(), z.number(), z.boolean(), z.record(z.any())]),
          ),
        ),
      ]),
    ).optional(),
    ctx: z.record(z.any()).optional(),
    errorId: z.string().optional(),
  }));

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace ErrorDto$ {
  /** @deprecated use `ErrorDto$inboundSchema` instead. */
  export const inboundSchema = ErrorDto$inboundSchema;
  /** @deprecated use `ErrorDto$outboundSchema` instead. */
  export const outboundSchema = ErrorDto$outboundSchema;
  /** @deprecated use `ErrorDto$Outbound` instead. */
  export type Outbound = ErrorDto$Outbound;
}
