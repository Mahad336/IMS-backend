import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { CategoryModule } from '../category/category.module';
import { UserModule } from '../user/user.module';
import { AbilityModule } from '../ability/ability.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor]),
    CategoryModule,
    UserModule,
    AbilityModule,
  ],
  controllers: [VendorController],
  providers: [VendorService],
  exports: [TypeOrmModule.forFeature([Vendor])],
})
export class VendorModule {}
