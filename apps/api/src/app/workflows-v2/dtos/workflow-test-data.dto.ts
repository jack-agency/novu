import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { JSONSchemaDto } from '../../shared/dtos/json-schema.dto';

export class WorkflowTestDataResponseDto {
  @ApiProperty({
    description: 'JSON Schema for recipient data',
    type: () => JSONSchemaDto,
  })
  @ValidateNested()
  @Type(() => JSONSchemaDto)
  to: JSONSchemaDto;

  @ApiProperty({
    description: 'JSON Schema for payload data',
    type: () => JSONSchemaDto,
  })
  @ValidateNested()
  @Type(() => JSONSchemaDto)
  payload: JSONSchemaDto;
}
