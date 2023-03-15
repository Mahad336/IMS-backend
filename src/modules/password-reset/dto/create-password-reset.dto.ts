import { IsOptional, IsString } from 'class-validator';

export class CreatePasswordResetDto {
  @IsOptional()
  otp?: string;

  @IsOptional()
  @IsString()
  newPassword?: string;
}
