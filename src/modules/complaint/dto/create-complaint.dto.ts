import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';
import { Organization } from 'src/modules/organization/entities/organization.entity';
import { Type } from 'class-transformer';

export class CreateComplaintDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  suggestion?: string;

  @IsNotEmpty()
  @IsNumber()
  submittedBy: User; // foreign key to User entity

  @IsOptional()
  attachments?: any;

  @IsOptional()
  @IsString()
  status?: string;

  @IsNotEmpty()
  organization: Organization; // foreign key to Organization entity

  @IsOptional()
  actionBy?: User; // foreign key to User entity

  @IsOptional()
  @Type(() => Date)
  actionDateTime?: Date;
}
