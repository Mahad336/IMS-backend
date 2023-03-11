import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePasswordResetDto } from './dto/create-password-reset.dto';
import { UpdatePasswordResetDto } from './dto/update-password-reset.dto';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PasswordResetService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mahad.younis@gigalabs.co',
        pass: 'demnbjtgtodbvvcb',
      },
    });
  }

  async sendResetPasswordEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    console.log(user);
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    const otp = Math.floor(Math.random() * 900000) + 100000; // generate random 6-digit OTP
    const hashedOtp = await bcrypt.hash(otp.toString(), 10); // hash the OTP

    user.passwordResetOtp = hashedOtp;
    user.passwordResetExpiration = new Date(Date.now() + 30 * 60 * 1000); // set expiration to 30 minutes from now
    await this.userRepository.save(user);

    try {
      const info = await this.transporter.sendMail({
        from: 'mahad.younis@gigalabs.co',
        to: email,
        subject: 'Reset your password',
        html: `Your one-time password is <b>${otp}</b>. Please use this to reset your password.`,
      });

      console.log(`Message sent to ${email}: ${info.messageId}`);
    } catch (error) {
      console.error(
        `Failed to send reset password email to ${email}: ${error}`,
      );
    }
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    const now = new Date();
    const expiration = user.passwordResetExpiration;

    if (expiration && now.getTime() > expiration.getTime()) {
      throw new Error(`OTP has expired`);
    }

    const hashedOtp = user.passwordResetOtp;

    if (!hashedOtp) {
      throw new Error(`No OTP found for user with email ${email}`);
    }

    const isOtpValid = await bcrypt.compare(String(otp), hashedOtp);

    if (!isOtpValid) {
      throw new Error(`Invalid OTP`);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordResetOtp = null;
    user.passwordResetExpiration = null;
    const changedUser = await this.userRepository.save(user);

    console.log(`Password reset successfully for ${email}`);
    return changedUser;
  }
}
