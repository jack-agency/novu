/**
 * The required format for a boolean flag key.
 */

export type BooleanFlagKey = `IS_${Uppercase<string>}_ENABLED` | `IS_${Uppercase<string>}_DISABLED`;
export type NumericFlagKey = `${Uppercase<string>}_NUMBER`;

export type FlagKey = BooleanFlagKey | NumericFlagKey;

export type FlagType<T> = T extends BooleanFlagKey ? boolean : T extends NumericFlagKey ? number : never;

/**
 * Helper function to test that enum keys and values match correct format.
 *
 * It is not possible as of Typescript 5.2 to declare a type for an enum key or value in-line.
 * Therefore, we must test the enum via a helper function that abstracts the enum to an object.
 *
 * If the test fails, you should review your `enum` to verify that both the
 * keys and values match the format specified by the `FlagKey` template literal type.
 * ref: https://stackoverflow.com/a/58181315
 *
 * @param testEnum - the Enum to type check
 */
export function testFlagEnumValidity<TEnum extends IFlags, IFlags = Record<FlagKey, FlagKey>>(
  _: TEnum & Record<Exclude<keyof TEnum, keyof IFlags>, ['Key must follow `FlagKey` format']>
) {}

export enum FeatureFlagsKeysEnum {
  // Boolean flags
  IS_API_IDEMPOTENCY_ENABLED = 'IS_API_IDEMPOTENCY_ENABLED',
  IS_API_RATE_LIMITING_DRY_RUN_ENABLED = 'IS_API_RATE_LIMITING_DRY_RUN_ENABLED',
  IS_API_RATE_LIMITING_KEYLESS_DRY_RUN_ENABLED = 'IS_API_RATE_LIMITING_KEYLESS_DRY_RUN_ENABLED',
  IS_API_RATE_LIMITING_ENABLED = 'IS_API_RATE_LIMITING_ENABLED',
  IS_CLOUDFLARE_SOCKETS_ENABLED = 'IS_CLOUDFLARE_SOCKETS_ENABLED',
  IS_CONTROLS_AUTOCOMPLETE_ENABLED = 'IS_CONTROLS_AUTOCOMPLETE_ENABLED',
  IS_EMAIL_INLINE_CSS_DISABLED = 'IS_EMAIL_INLINE_CSS_DISABLED',
  IS_EVENT_QUOTA_THROTTLER_ENABLED = 'IS_EVENT_QUOTA_THROTTLER_ENABLED',
  IS_INTEGRATION_INVALIDATION_DISABLED = 'IS_INTEGRATION_INVALIDATION_DISABLED',
  IS_NEW_MESSAGES_API_RESPONSE_ENABLED = 'IS_NEW_MESSAGES_API_RESPONSE_ENABLED',
  IS_TEMPLATE_STORE_ENABLED = 'IS_TEMPLATE_STORE_ENABLED',
  IS_TOPICS_PAGE_ACTIVE = 'IS_TOPICS_PAGE_ACTIVE',
  IS_LAYOUTS_PAGE_ACTIVE = 'IS_LAYOUTS_PAGE_ACTIVE',
  IS_USAGE_ALERTS_ENABLED = 'IS_USAGE_ALERTS_ENABLED',
  IS_USE_MERGED_DIGEST_ID_ENABLED = 'IS_USE_MERGED_DIGEST_ID_ENABLED',
  IS_V2_ENABLED = 'IS_V2_ENABLED',
  IS_V2_TEMPLATE_EDITOR_ENABLED = 'IS_V2_TEMPLATE_EDITOR_ENABLED',
  IS_WORKFLOW_NODE_PREVIEW_ENABLED = 'IS_WORKFLOW_NODE_PREVIEW_ENABLED',
  IS_PAYLOAD_SCHEMA_ENABLED = 'IS_PAYLOAD_SCHEMA_ENABLED',
  IS_WEBHOOKS_MANAGEMENT_ENABLED = 'IS_WEBHOOKS_MANAGEMENT_ENABLED',
  IS_INCR_IF_EXIST_USAGE_ENABLED = 'IS_INCR_IF_EXIST_USAGE_ENABLED',
  IS_KEYLESS_ENVIRONMENT_CREATION_ENABLED = 'IS_KEYLESS_ENVIRONMENT_CREATION_ENABLED',
  IS_TEST_PROVIDER_LIMITS_ENABLED = 'IS_TEST_PROVIDER_LIMITS_ENABLED',
  IS_2025_Q1_LEGACY_TIERING_MIGRATION = 'IS_2025_Q1_LEGACY_TIERING_MIGRATION',
  IS_SUBSCRIBER_ID_VALIDATION_DRY_RUN_ENABLED = 'IS_SUBSCRIBER_ID_VALIDATION_DRY_RUN_ENABLED',
  IS_TOPIC_KEYS_VALIDATION_DRY_RUN_ENABLED = 'IS_TOPIC_KEYS_VALIDATION_DRY_RUN_ENABLED',
  IS_RBAC_ENABLED = 'IS_RBAC_ENABLED',
  IS_HTML_EDITOR_ENABLED = 'IS_HTML_EDITOR_ENABLED',
  IS_HTTP_LOGS_PAGE_ENABLED = 'IS_HTTP_LOGS_PAGE_ENABLED',
  IS_ANALYTICS_LOGS_ENABLED = 'IS_ANALYTICS_LOGS_ENABLED',
  IS_TRANSLATION_ENABLED = 'IS_TRANSLATION_ENABLED',

  // Numeric flags
  MAX_WORKFLOW_LIMIT_NUMBER = 'MAX_WORKFLOW_LIMIT_NUMBER',
  MAX_STEPS_PER_WORKFLOW_LIMIT_NUMBER = 'MAX_STEPS_PER_WORKFLOW_LIMIT_NUMBER',
  MAX_DEFER_DURATION_IN_MS_NUMBER = 'MAX_DEFER_DURATION_IN_MS_NUMBER',
}

export type FeatureFlags = {
  [key in FeatureFlagsKeysEnum]: boolean | number | undefined;
};
