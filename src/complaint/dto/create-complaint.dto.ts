import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { Type } from 'class-transformer';

export class CreateComplaintDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  suggestion: string;

  submissionDate?: Date;

  @IsNotEmpty()
  @IsNumber()
  submittedBy: User; // foreign key to User entity

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
