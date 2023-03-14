// CreateCategory.dto.ts

import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  parentId?: number;

  @IsArray()
  @IsOptional()
  vendorIds?: number[];
}
