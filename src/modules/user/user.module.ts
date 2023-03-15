import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthGuardMiddleware } from 'src/common/middleware/auth.guard.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, AuthGuardMiddleware],
  exports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
