import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthGuardMiddleware } from 'src/auth/guards/auth-guard.middleware';
import { UserValidator } from './validators/user.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserValidator],
  exports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
