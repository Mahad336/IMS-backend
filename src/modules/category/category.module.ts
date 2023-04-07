import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ItemService } from '../item/item.service';
import { RequestService } from '../request/request.service';
import { ItemModule } from '../item/item.module';
import { RequestModule } from '../request/request.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), ItemModule, RequestModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [TypeOrmModule.forFeature([Category])],
})
export class CategoryModule {}
