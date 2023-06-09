import { Module } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { ComplaintController } from './complaint.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';
import { UserModule } from '../user/user.module';
import { AbilityModule } from '../ability/ability.module';

@Module({
  imports: [TypeOrmModule.forFeature([Complaint]), UserModule, AbilityModule],
  controllers: [ComplaintController],
  providers: [ComplaintService],
  exports: [TypeOrmModule.forFeature([Complaint])],
})
export class ComplaintModule {}
