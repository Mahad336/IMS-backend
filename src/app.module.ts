import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { OrganizationModule } from './organization/organization.module';
import { RoleModule } from './role/role.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { CategoryModule } from './category/category.module';
import { VendorModule } from './vendor/vendor.module';
import { RequestModule } from './request/request.module';
import { ItemModule } from './item/item.module';
import { ComplaintModule } from './complaint/complaint.module';
import config from 'ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    UserModule,
    OrganizationModule,
    RoleModule,
    PasswordResetModule,
    CategoryModule,
    VendorModule,
    RequestModule,
    ItemModule,
    ComplaintModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
