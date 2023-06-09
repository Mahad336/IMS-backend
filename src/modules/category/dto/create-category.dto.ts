import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { Organization } from 'src/modules/organization/entities/organization.entity';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  parentId?: number;

  @IsOptional()
  subCategories?: string[];

  @IsNotEmpty()
  organization: Organization;
}
