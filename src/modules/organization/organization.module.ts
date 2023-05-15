import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { Organization } from './entities/organization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/modules/user/user.module';
import { AuthGuardMiddleware } from 'src/auth/guards/auth-guard.middleware';
import { AbilityModule } from '../ability/ability.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization]),
    UserModule,
    AbilityModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [TypeOrmModule.forFeature([Organization])],
})
export class OrganizationModule {}
