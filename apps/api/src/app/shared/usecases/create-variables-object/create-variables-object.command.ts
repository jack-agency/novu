import { EnvironmentCommand } from '@novu/application-generic';
import { IsObject, IsOptional, IsArray, IsDefined } from 'class-validator';
import { JSONSchemaDto } from '../../dtos/json-schema.dto';

export class CreateVariablesObjectCommand extends EnvironmentCommand {
  @IsDefined()
  @IsArray()
  controlValues: unknown[];

  @IsObject()
  @IsOptional()
  payloadSchema?: JSONSchemaDto;

  @IsObject()
  @IsOptional()
  variableSchema?: JSONSchemaDto;
}
