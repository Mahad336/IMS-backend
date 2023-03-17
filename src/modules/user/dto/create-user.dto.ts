import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/modules/role/entities/role.entity';
import { Organization } from 'src/modules/organization/entities/organization.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  @IsString()
  readonly name: string;

  @IsEmail()
  @IsString()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly passwordResetOtp: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly passwordResetExpiration: Date;

  @ApiProperty()
  @IsString()
  readonly contact: string;

  @IsString()
  readonly image: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly designation: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly department: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly education: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly companyExperience: number;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly totalExperience: number;

  @ApiProperty()
  readonly role: Role;

  @ApiProperty()
  readonly organization: Organization;

  @ApiProperty()
  readonly createdDate: Date;

  @ApiProperty()
  readonly updatedDate: Date;
}
