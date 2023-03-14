import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/role/entities/role.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Request } from 'src/request/entities/request.entity';

export class CreateUserDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsEmail()
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

  @ApiProperty()
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
