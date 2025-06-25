import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { NotificationTemplateEntity, JsonSchemaTypeEnum, JsonSchemaFormatEnum } from '@novu/dal';
import { FeatureFlagsKeysEnum } from '@novu/shared';
import { FeatureFlagsService } from '@novu/application-generic';
import { PreviewPayloadDto } from '../../../dtos';
import { JSONSchemaDto } from '../../../../shared/dtos/json-schema.dto';
import { buildVariablesSchema } from '../../../../shared/utils/create-schema';

@Injectable()
export class SchemaBuilderService {
  constructor(private readonly featureFlagService: FeatureFlagsService) {}

  async buildVariablesSchema(
    variablesObject: Record<string, unknown>,
    variables: JSONSchemaDto
  ): Promise<JSONSchemaDto> {
    const { payload } = variablesObject;
    const payloadSchema = buildVariablesSchema(payload);

    if (Object.keys(payloadSchema).length === 0) {
      return variables;
    }

    return _.merge(variables, { properties: { payload: payloadSchema } });
  }

  async buildPreviewPayloadSchema(
    previewPayloadExample: PreviewPayloadDto,
    workflowPayloadSchema?: JSONSchemaDto,
    workflow?: NotificationTemplateEntity
  ): Promise<JSONSchemaDto | null> {
    if (!workflowPayloadSchema) {
      return null;
    }

    const isV2TemplateEditorEnabled = workflow
      ? await this.featureFlagService.getFlag({
          key: FeatureFlagsKeysEnum.IS_V2_TEMPLATE_EDITOR_ENABLED,
          defaultValue: false,
          organization: { _id: workflow._organizationId },
          environment: { _id: workflow._environmentId },
        })
      : false;

    const schema: JSONSchemaDto = {
      type: JsonSchemaTypeEnum.OBJECT,
      properties: {},
      additionalProperties: false,
    };

    if (previewPayloadExample.payload) {
      schema.properties!.payload = workflowPayloadSchema || {
        type: JsonSchemaTypeEnum.OBJECT,
        additionalProperties: true,
      };
    }

    if (previewPayloadExample.subscriber || isV2TemplateEditorEnabled) {
      schema.properties!.subscriber = {
        type: JsonSchemaTypeEnum.OBJECT,
        properties: {
          subscriberId: { type: JsonSchemaTypeEnum.STRING },
          firstName: { type: JsonSchemaTypeEnum.STRING },
          lastName: { type: JsonSchemaTypeEnum.STRING },
          email: { type: JsonSchemaTypeEnum.STRING, format: JsonSchemaFormatEnum.EMAIL },
          phone: { type: JsonSchemaTypeEnum.STRING },
          avatar: { type: JsonSchemaTypeEnum.STRING },
          locale: { type: JsonSchemaTypeEnum.STRING },
          data: { type: JsonSchemaTypeEnum.OBJECT, additionalProperties: true },
        },
        additionalProperties: true,
      };
    }

    if (previewPayloadExample.steps || isV2TemplateEditorEnabled) {
      schema.properties!.steps = {
        type: JsonSchemaTypeEnum.OBJECT,
        description: 'Steps data from previous workflow executions',
        additionalProperties: {
          type: JsonSchemaTypeEnum.OBJECT,
          properties: {
            eventCount: { type: JsonSchemaTypeEnum.NUMBER },
            events: {
              type: JsonSchemaTypeEnum.ARRAY,
              items: {
                type: JsonSchemaTypeEnum.OBJECT,
                properties: {
                  payload: { type: JsonSchemaTypeEnum.OBJECT, additionalProperties: true },
                },
                additionalProperties: true,
              },
            },
          },
          additionalProperties: true,
        },
      };
    }

    return schema;
  }
}
