/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";
import { safeParse } from "../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";
import {
  NotificationTriggerDto,
  NotificationTriggerDto$inboundSchema,
  NotificationTriggerDto$Outbound,
  NotificationTriggerDto$outboundSchema,
} from "./notificationtriggerdto.js";
import {
  ResourceOriginEnum,
  ResourceOriginEnum$inboundSchema,
  ResourceOriginEnum$outboundSchema,
} from "./resourceoriginenum.js";

export type ActivityNotificationTemplateResponseDto = {
  /**
   * Unique identifier of the template
   */
  id?: string | undefined;
  /**
   * Name of the template
   */
  name: string;
  /**
   * Origin of the workflow
   */
  origin?: ResourceOriginEnum | undefined;
  /**
   * Triggers of the template
   */
  triggers: Array<NotificationTriggerDto>;
};

/** @internal */
export const ActivityNotificationTemplateResponseDto$inboundSchema: z.ZodType<
  ActivityNotificationTemplateResponseDto,
  z.ZodTypeDef,
  unknown
> = z.object({
  _id: z.string().optional(),
  name: z.string(),
  origin: ResourceOriginEnum$inboundSchema.optional(),
  triggers: z.array(NotificationTriggerDto$inboundSchema),
}).transform((v) => {
  return remap$(v, {
    "_id": "id",
  });
});

/** @internal */
export type ActivityNotificationTemplateResponseDto$Outbound = {
  _id?: string | undefined;
  name: string;
  origin?: string | undefined;
  triggers: Array<NotificationTriggerDto$Outbound>;
};

/** @internal */
export const ActivityNotificationTemplateResponseDto$outboundSchema: z.ZodType<
  ActivityNotificationTemplateResponseDto$Outbound,
  z.ZodTypeDef,
  ActivityNotificationTemplateResponseDto
> = z.object({
  id: z.string().optional(),
  name: z.string(),
  origin: ResourceOriginEnum$outboundSchema.optional(),
  triggers: z.array(NotificationTriggerDto$outboundSchema),
}).transform((v) => {
  return remap$(v, {
    id: "_id",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace ActivityNotificationTemplateResponseDto$ {
  /** @deprecated use `ActivityNotificationTemplateResponseDto$inboundSchema` instead. */
  export const inboundSchema =
    ActivityNotificationTemplateResponseDto$inboundSchema;
  /** @deprecated use `ActivityNotificationTemplateResponseDto$outboundSchema` instead. */
  export const outboundSchema =
    ActivityNotificationTemplateResponseDto$outboundSchema;
  /** @deprecated use `ActivityNotificationTemplateResponseDto$Outbound` instead. */
  export type Outbound = ActivityNotificationTemplateResponseDto$Outbound;
}

export function activityNotificationTemplateResponseDtoToJSON(
  activityNotificationTemplateResponseDto:
    ActivityNotificationTemplateResponseDto,
): string {
  return JSON.stringify(
    ActivityNotificationTemplateResponseDto$outboundSchema.parse(
      activityNotificationTemplateResponseDto,
    ),
  );
}

export function activityNotificationTemplateResponseDtoFromJSON(
  jsonString: string,
): SafeParseResult<
  ActivityNotificationTemplateResponseDto,
  SDKValidationError
> {
  return safeParse(
    jsonString,
    (x) =>
      ActivityNotificationTemplateResponseDto$inboundSchema.parse(
        JSON.parse(x),
      ),
    `Failed to parse 'ActivityNotificationTemplateResponseDto' from JSON`,
  );
}
