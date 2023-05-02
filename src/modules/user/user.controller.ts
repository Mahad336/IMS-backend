import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserValidator } from './validators/user.validator';
import { AuthGuardMiddleware } from 'src/auth/guards/auth-guard.middleware';
import { ParseIntPipe } from '@nestjs/common';
import { validate } from 'class-validator';
import { CheckAblities } from '../ability/decorators/abilities.decorators';
import { Action } from '../ability/ability.factory';
import { User } from './entities/user.entity';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { TransformUserDataInterceptor } from './interceptors/transform-user-data.interceptors';
import { FileInterceptor } from '@nestjs/platform-express';
import { Organization } from '../organization/entities/organization.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userValidator: UserValidator,
  ) {}

  @Post()
  @UseGuards(AuthGuardMiddleware)
  @UseInterceptors(FileInterceptor('imageFile'))
  async create(
    @Body() createUserDto: CreateUserDto,
    @Body('organization', ParseIntPipe) organization: Organization,
    @UploadedFile() imageFile,
    @Req() req,
  ) {
    const errors = await validate(createUserDto);
    if (errors.length > 0) return 'Send Accurate Data';
    await this.userValidator.validateCreateUserDto(createUserDto);
    const currUserRole = req.user.role.name;
    const user = await this.userService.create(
      { ...createUserDto, organization },
      currUserRole,
      imageFile,
    );
    return user;
  }

  @Get()
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
  @CheckAblities({ action: Action.Read, subject: User })
  @UseInterceptors(TransformUserDataInterceptor)
  findAll(@Req() req) {
    return this.userService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuardMiddleware)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    await this.userValidator.validateUpdateUserDto(+id, updateUserDto);
    return this.userService.update(+id, updateUserDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
