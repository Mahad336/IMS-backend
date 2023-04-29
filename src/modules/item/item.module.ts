import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), UserModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [TypeOrmModule.forFeature([Item])],
})
export class ItemModule {}
