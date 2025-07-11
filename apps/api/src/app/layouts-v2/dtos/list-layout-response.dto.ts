import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LayoutResponseDto } from './layout-response.dto';

export class ListLayoutResponseDto {
  @ApiProperty({
    description: 'List of layouts',
    type: LayoutResponseDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LayoutResponseDto)
  layouts: LayoutResponseDto[];

  @ApiProperty({
    description: 'Total number of layouts',
    type: 'number',
  })
  @IsNumber()
  totalCount: number;
}
