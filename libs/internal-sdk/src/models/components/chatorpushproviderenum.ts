/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { ClosedEnum } from "../../types/enums.js";

/**
 * The provider identifier for the credentials
 */
export const ChatOrPushProviderEnum = {
  Slack: "slack",
  Discord: "discord",
  Msteams: "msteams",
  Mattermost: "mattermost",
  Ryver: "ryver",
  Zulip: "zulip",
  GrafanaOnCall: "grafana-on-call",
  Getstream: "getstream",
  RocketChat: "rocket-chat",
  WhatsappBusiness: "whatsapp-business",
  ChatWebhook: "chat-webhook",
  Fcm: "fcm",
  Apns: "apns",
  Expo: "expo",
  OneSignal: "one-signal",
  Pushpad: "pushpad",
  PushWebhook: "push-webhook",
  PusherBeams: "pusher-beams",
} as const;
/**
 * The provider identifier for the credentials
 */
export type ChatOrPushProviderEnum = ClosedEnum<typeof ChatOrPushProviderEnum>;

/** @internal */
export const ChatOrPushProviderEnum$inboundSchema: z.ZodNativeEnum<
  typeof ChatOrPushProviderEnum
> = z.nativeEnum(ChatOrPushProviderEnum);

/** @internal */
export const ChatOrPushProviderEnum$outboundSchema: z.ZodNativeEnum<
  typeof ChatOrPushProviderEnum
> = ChatOrPushProviderEnum$inboundSchema;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace ChatOrPushProviderEnum$ {
  /** @deprecated use `ChatOrPushProviderEnum$inboundSchema` instead. */
  export const inboundSchema = ChatOrPushProviderEnum$inboundSchema;
  /** @deprecated use `ChatOrPushProviderEnum$outboundSchema` instead. */
  export const outboundSchema = ChatOrPushProviderEnum$outboundSchema;
}
