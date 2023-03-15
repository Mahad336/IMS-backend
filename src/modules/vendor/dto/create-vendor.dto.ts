// CreateVendor.dto.ts

import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { Category } from 'src/modules/category/entities/category.entity';

export class CreateVendorDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  contact: string;

  @IsArray()
  categories: Category[];

  @IsArray()
  subcategories: Category[];
}
