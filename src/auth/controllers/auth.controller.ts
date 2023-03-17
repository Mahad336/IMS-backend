import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/modules/user/entities/user.entity';
import { Res } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('password-reset/:email')
  sendResetPasswordEmail(@Param('email') email: string) {
    return this.authService.sendResetPasswordEmail(email);
  }

  @Put('password-reset/:email')
  async resetPassword(
    @Param('email') email: string,
    @Body() { otp, newPassword }: { otp: string; newPassword: string },
  ) {
    return await this.authService.resetPassword(email, otp, newPassword);
  }

  @Post('/login')
  async login(@Body() body: User, @Res() res: any) {
    const user = await this.authService.login(body, res);
    res.send({ user });
  }
}
