import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCategoryDto } from 'src/modules/category/dto/create-category.dto';
import { CreateVendorDto } from 'src/modules/vendor/dto/create-vendor.dto';
import { Organization } from 'src/modules/organization/entities/organization.entity';
import { User } from 'src/modules/user/entities/user.entity';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsString()
  serialNumber: string;

  @IsString()
  description: string;

  @IsNumber()
  unitPrice: number;

  @IsDateString()
  dateOfPurchase: Date;

  @IsNumber()
  currentPrice: number;

  @IsNumber()
  deprecatedPrice: number;

  @IsNumber()
  percentageDepreciation: number;

  @IsOptional()
  @IsString()
  assignedTo?: User;

  @ValidateNested()
  @Type(() => CreateCategoryDto)
  category: CreateCategoryDto;

  @ValidateNested()
  @Type(() => CreateCategoryDto)
  subcategory: CreateCategoryDto;

  @ValidateNested()
  @Type(() => CreateVendorDto)
  vendor: CreateVendorDto;

  @IsNotEmpty()
  organization: Organization;
}
