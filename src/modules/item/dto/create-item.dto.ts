import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Organization } from 'src/modules/organization/entities/organization.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Vendor } from 'src/modules/vendor/entities/vendor.entity';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsString()
  serialNumber: string;

  @IsString()
  description: string;

  @IsNumber()
  unitPrice: number;

  @IsOptional()
  dateOfPurchase?: Date;

  @IsNumber()
  @IsOptional()
  currentPrice?: number;

  @IsNumber()
  @IsOptional()
  deprecatedPrice?: number;

  @IsNumber()
  @IsOptional()
  percentageDepreciation?: number;

  @IsOptional()
  assignedTo?: User;

  @Type(() => Category)
  category: Category;

  @Type(() => Category)
  subcategory: Category;

  @Type(() => Vendor)
  vendor: Vendor;

  @IsNotEmpty()
  organization: Organization;
}
