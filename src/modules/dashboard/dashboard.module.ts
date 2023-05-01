import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UserModule } from '../user/user.module';
import { ComplaintModule } from '../complaint/complaint.module';
import { Organization } from '../organization/entities/organization.entity';
import { OrganizationModule } from '../organization/organization.module';
import { ItemModule } from '../item/item.module';
import { CategoryModule } from '../category/category.module';
import { VendorModule } from '../vendor/vendor.module';

@Module({
  imports: [
    UserModule,
    ComplaintModule,
    OrganizationModule,
    ItemModule,
    CategoryModule,
    VendorModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
