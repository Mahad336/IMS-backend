import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthMiddleware } from 'src/middleware/auth.middleware';
import { OrganizationModule } from 'src/organization/organization.module';
import { RequestModule } from 'src/request/request.module';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, AuthMiddleware],
  exports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
