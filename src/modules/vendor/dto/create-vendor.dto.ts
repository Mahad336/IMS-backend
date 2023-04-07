// CreateVendor.dto.ts

import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { Category } from 'src/modules/category/entities/category.entity';
import { Organization } from 'src/modules/organization/entities/organization.entity';

export class CreateVendorDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  contact: string;

  @IsNotEmpty()
  organization: Organization;

  @IsArray()
  categories: Category[];

  @IsArray()
  subcategories: Category[];
}
