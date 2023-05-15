import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { UserModule } from '../user/user.module';
import { AbilityModule } from '../ability/ability.module';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), UserModule, AbilityModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [TypeOrmModule.forFeature([Item])],
})
export class ItemModule {}
