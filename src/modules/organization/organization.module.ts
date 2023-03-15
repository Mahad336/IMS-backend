import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { Organization } from './entities/organization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/modules/user/user.module';
import { AuthGuardMiddleware } from 'src/common/middleware/auth.guard.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Organization]), UserModule],
  controllers: [OrganizationController],
  providers: [OrganizationService, AuthGuardMiddleware],
  exports: [TypeOrmModule.forFeature([Organization])],
})
export class OrganizationModule {}
