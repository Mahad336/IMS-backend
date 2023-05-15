import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { AuthGuardMiddleware } from 'src/auth/guards/auth-guard.middleware';
import { TransformItemDataInterceptor } from './interceptors/transform-item-data.interceptor';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { CheckAblities } from '../ability/decorators/abilities.decorators';
import { Action } from '../ability/ability.factory';
import { Item } from './entities/item.entity';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @CheckAblities({ action: Action.Create, subject: Item })
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
  async create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Get()
  @UseGuards(AuthGuardMiddleware)
  @UseInterceptors(TransformItemDataInterceptor)
  findAll(@Req() req) {
    const user = req?.user;
    return this.itemService.findAll(user);
  }

  @Get(':id')
  @CheckAblities({ action: Action.Read, subject: Item })
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
  findOne(@Param('id') id: string, @Req() req) {
    return this.itemService.findOne(+id, req.user);
  }

  @Patch(':id')
  @CheckAblities({ action: Action.Update, subject: Item })
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
  update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @Req() req,
  ) {
    return this.itemService.update(+id, updateItemDto, req.user);
  }

  @Delete(':id')
  @CheckAblities({ action: Action.Delete, subject: Item })
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.itemService.remove(+id, req.user);
  }
}
