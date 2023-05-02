import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from 'src/modules/user/user.service';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { Res, Req } from '@nestjs/common';
import { AuthGuardMiddleware } from '../guards/auth-guard.middleware';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('reset-password/generate-otp')
  sendResetPasswordEmail(@Body('email') email: string) {
    return this.authService.sendResetPasswordEmail(email);
  }

  @Post('reset-password/validate-otp')
  async validateOtp(
    @Body('email') email: string,
    @Body('otp') otp: string,
    @Res() res: any,
  ) {
    const token = await this.authService.validateOtp(email, otp);
    res.cookie('jwt', token, { maxAge: 3 * 24 * 60 * 60 * 1000 });
    return res.send({ message: 'OTP validated Successfuly' });
  }

  @Put('reset-password/update-password')
  @UseGuards(AuthGuardMiddleware)
  async updatePassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() req,
    @Res() res,
  ): Promise<any> {
    const userId = req.user.id;
    const { newPassword } = resetPasswordDto;
    await this.authService.updatePassword(userId, newPassword);
    res.clearCookie('jwt');
    return res.status(200).send({ message: 'Password updated successfully' });
  }

  @Post('/login')
  async login(@Body() body, @Res() res: any) {
    const user = await this.authService.login(body, res);
    res.send(user);
  }

  @Get('current-user')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardMiddleware)
  findCurrentUser(@Req() req) {
    return req.user;
  }

  @Post('/logout')
  @UseGuards(AuthGuardMiddleware)
  async logout(@Res() res, @Req() req) {
    const { jwt } = req.cookies;
    if (jwt) {
      res.clearCookie('jwt');
    }
    res.send({ message: 'Successfuly logged Out', user: req.user });
  }
}
