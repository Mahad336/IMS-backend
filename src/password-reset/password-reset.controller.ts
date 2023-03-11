import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { CreatePasswordResetDto } from './dto/create-password-reset.dto';
import { UpdatePasswordResetDto } from './dto/update-password-reset.dto';

@Controller('password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post(':email')
  sendResetPasswordEmail(@Param('email') email: string) {
    return this.passwordResetService.sendResetPasswordEmail(email);
  }

  @Put(':email')
  async resetPassword(
    @Param('email') email: string,
    @Body() { otp, newPassword }: { otp: string; newPassword: string },
  ) {
    return await this.passwordResetService.resetPassword(
      email,
      otp,
      newPassword,
    );
  }
}
