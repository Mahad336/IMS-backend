import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from 'src/modules/user/entities/user.entity';
import { Organization } from 'src/modules/organization/entities/organization.entity';
import { Item } from 'src/modules/item/entities/item.entity';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  organization: Organization; // foreign key to Organization entity

  @IsNotEmpty()
  submittedBy: User; // foreign key to User entity

  @IsOptional()
  actionBy?: User; // foreign key to User entity

  @IsNotEmpty()
  item: Item;

  @IsNotEmpty()
  status: string;

  @Type(() => Date)
  actionDateTime?: Date;

  @Type(() => Date)
  createdDate: Date;

  @Type(() => Date)
  updatedDate: Date;
}
