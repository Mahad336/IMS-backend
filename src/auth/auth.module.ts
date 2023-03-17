import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from 'src/modules/user/user.module';
import { AuthGuardMiddleware } from './guards/auth-guard.middleware';
import { UserService } from 'src/modules/user/user.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
