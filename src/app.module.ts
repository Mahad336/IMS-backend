import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { RoleModule } from './modules/role/role.module';
import { CategoryModule } from './modules/category/category.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { RequestModule } from './modules/request/request.module';
import { ItemModule } from './modules/item/item.module';
import { ConfigModule } from '@nestjs/config';
import { ComplaintModule } from './modules/complaint/complaint.module';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AbilityModule } from './modules/ability/ability.module';
import { NestCloudinaryModule } from './nest-cloudinary/cloudinary.module';
import getConfig from './config/ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getConfig,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    OrganizationModule,
    RoleModule,
    CategoryModule,
    VendorModule,
    RequestModule,
    ItemModule,
    ComplaintModule,
    AuthModule,
    AbilityModule,
    NestCloudinaryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
