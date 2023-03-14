import { User } from 'src/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly image: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly bio: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly zip: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly representativeName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly representativeContact: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  readonly createdDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  readonly updatedDate: Date;
}
