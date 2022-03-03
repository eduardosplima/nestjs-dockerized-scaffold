import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, Max, Min, ValidateIf } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export abstract class PaginationQueryDto {
  @ApiProperty({ description: 'Page start (greater than or equal 0)' })
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  pageStart: number;

  @ApiProperty({
    description:
      'Page size (greater than or equal 5 and lower than or equal 100)',
  })
  @Max(100)
  @Min(5)
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  pageSize: number;

  @ApiProperty({
    description: 'Field that will be ordered',
    required: false,
  })
  @ValidateIf((_this: PaginationQueryDto) => !!_this.pageOrder)
  abstract pageSort: string;

  @ApiProperty({
    description: 'Ordering direction ("ASC" or "DESC")',
    enum: ['ASC', 'DESC'],
    required: false,
  })
  @IsIn(['ASC', 'DESC'])
  @ValidateIf((_this: PaginationQueryDto) => !!_this.pageSort)
  pageOrder: 'ASC' | 'DESC';
}
