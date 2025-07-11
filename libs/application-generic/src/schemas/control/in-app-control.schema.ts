import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { UiComponentEnum, UiSchema, UiSchemaGroupEnum } from '@novu/shared';
import { JSONSchemaEntity } from '@novu/dal';
import { defaultOptions, skipStepUiSchema, skipZodSchema } from './shared';

/**
 * Regex pattern for validating URLs with template variables. Matches three cases:
 *
 * 1. URLs that start with template variables like {{variable}}
 *    - Example: {{variable}}, {{variable}}/path
 *
 * 2. Full URLs that may contain template variables
 *    - Excludes mailto: links
 *    - Example: https://example.com, https://example.com/{{variable}}, https://{{variable}}.com
 *
 * 3. Paths starting with / that may contain template variables
 *    - Example: /path/to/page, /path/{{variable}}/page
 *
 * Pattern is optimized to prevent exponential backtracking while maintaining all functionality
 */
const redirectUrlRegex =
  /^(?:\{\{[^}]*\}\}.*|(?!mailto:)(?:https?:\/\/[^\s/$.?#][^\s]*(?:\{\{[^}]*\}\})*[^\s]*)|\/[^\s]*(?:\{\{[^}]*\}\})*[^\s]*)$/;

const redirectZodSchema = z.object({
  url: z.string().regex(redirectUrlRegex),
  target: z.enum(['_self', '_blank', '_parent', '_top', '_unfencedTop']),
});

const actionZodSchema = z
  .object({
    label: z.string(),
    redirect: redirectZodSchema.optional(),
  })
  .optional();

// First, define the common properties that both schema variants will share
const commonInAppProperties = {
  skip: skipZodSchema,
  disableOutputSanitization: z.boolean().optional(),
  avatar: z.string().regex(redirectUrlRegex).optional(),
  primaryAction: actionZodSchema,
  secondaryAction: actionZodSchema,
  data: z.object({}).catchall(z.unknown()).optional(),
  redirect: redirectZodSchema.optional(),
};

const subjectRequiredSchema = z.object({
  subject: z.string().min(1),
  body: z.string().optional(),
  ...commonInAppProperties,
});

const bodyRequiredSchema = z.object({
  subject: z.string().optional(),
  body: z.string().min(1),
  ...commonInAppProperties,
});

// Write it this way because of how translation from zod to json schema works
export const inAppControlZodSchema = z.union([subjectRequiredSchema, bodyRequiredSchema]);

export type InAppRedirectType = z.infer<typeof redirectZodSchema>;
export type InAppActionType = z.infer<typeof actionZodSchema>;
export type InAppControlType = z.infer<typeof inAppControlZodSchema>;

export const inAppRedirectSchema = zodToJsonSchema(redirectZodSchema, defaultOptions) as JSONSchemaEntity;
export const inAppActionSchema = zodToJsonSchema(actionZodSchema, defaultOptions) as JSONSchemaEntity;
export const inAppControlSchema = zodToJsonSchema(inAppControlZodSchema, defaultOptions) as JSONSchemaEntity;

const redirectPlaceholder = {
  url: {
    placeholder: '',
  },
  target: {
    placeholder: '_self',
  },
};

export const inAppUiSchema: UiSchema = {
  group: UiSchemaGroupEnum.IN_APP,
  properties: {
    body: {
      component: UiComponentEnum.IN_APP_BODY,
      placeholder: '',
    },
    avatar: {
      component: UiComponentEnum.IN_APP_AVATAR,
      placeholder: 'https://dashboard.novu.co/images/info.svg',
    },
    subject: {
      component: UiComponentEnum.IN_APP_SUBJECT,
      placeholder: '',
    },
    primaryAction: {
      component: UiComponentEnum.IN_APP_BUTTON_DROPDOWN,
      placeholder: null,
    },
    secondaryAction: {
      component: UiComponentEnum.IN_APP_BUTTON_DROPDOWN,
      placeholder: null,
    },
    redirect: {
      component: UiComponentEnum.URL_TEXT_BOX,
      placeholder: redirectPlaceholder,
    },
    skip: skipStepUiSchema.properties.skip,
    disableOutputSanitization: {
      component: UiComponentEnum.IN_APP_DISABLE_SANITIZATION_SWITCH,
      placeholder: false,
    },
    data: {
      component: UiComponentEnum.DATA,
      placeholder: null,
    },
  },
};
