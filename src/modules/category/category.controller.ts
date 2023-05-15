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
} from '@nestjs/common';
import { AuthGuardMiddleware } from 'src/auth/guards/auth-guard.middleware';
import { Action } from '../ability/ability.factory';
import { CheckAblities } from '../ability/decorators/abilities.decorators';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { User } from '../user/entities/user.entity';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
  @CheckAblities({ action: Action.Create, subject: Category })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
  @CheckAblities({ action: Action.Read, subject: Category })
  findAll(@Req() req) {
    const user: User = req?.user;
    return this.categoryService.findAll(user);
  }

  @Get('stats')
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
  @CheckAblities({ action: Action.Read, subject: Category })
  getSubCategoriesForCategories(@Req() req) {
    const user = req.user;
    return this.categoryService.getSubCategoriesForCategory(user);
  }

  @Get(':id')
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
  @CheckAblities({ action: Action.Read, subject: Category })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
  @CheckAblities({ action: Action.Update, subject: Category })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req,
  ) {
    return this.categoryService.update(+id, updateCategoryDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
