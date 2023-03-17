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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserValidator } from './validators/user.validator';
import { AuthGuardMiddleware } from 'src/auth/guards/auth-guard.middleware';
import { ParseIntPipe } from '@nestjs/common';
import { validate } from 'class-validator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userValidator: UserValidator,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: any) {
    const errors = await validate(createUserDto);
    console.log('errors ==> ', errors);
    if (errors.length > 0) return 'Send Accurate Data';
    console.log(createUserDto);
    await this.userValidator.validateCreateUserDto(createUserDto);
    const user = await this.userService.create(createUserDto, res);
    res.send({ user });
  }

  @Get()
  @UseGuards(AuthGuardMiddleware)
  findAll(@Req() req) {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userValidator.validateUpdateUserDto(+id, updateUserDto);
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
