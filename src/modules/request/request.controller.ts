import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { AuthGuardMiddleware } from 'src/auth/guards/auth-guard.middleware';
import { UserRole } from 'src/common/enums/user-role.enums';
import { Request } from './entities/request.entity';
import { TransformRequestDataInterceptor } from './interceptors/transform-request-data.interceptor';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { CheckAblities } from '../ability/decorators/abilities.decorators';
import { Action } from '../ability/ability.factory';
import { Complaint } from '../complaint/entities/complaint.entity';
import { User } from '../user/entities/user.entity';

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
  @CheckAblities({ action: Action.Create, subject: Complaint })
  create(@Body() createRequestDto: CreateRequestDto) {
    console.log(createRequestDto);
    return this.requestService.create(createRequestDto);
  }
  @Get()
  @UseGuards(AuthGuardMiddleware)
  @UseInterceptors(TransformRequestDataInterceptor)
  async findAll(@Req() req, @Query('type') type?: string): Promise<Request[]> {
    const user = req.user;
    switch (user?.role.name) {
      case UserRole.ADMIN:
        return this.requestService.getAdminRequests(user, type);
      case UserRole.EMPLOYEE:
        return this.requestService.getEmployeeRequests(user, type);
      default:
        throw new HttpException('Invalid user role', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuardMiddleware)
  findOne(@Param('id') id: string, @Req() req) {
    return this.requestService.findOne(+id, req.user);
  }

  @Patch(':id')
  @UseGuards(AuthGuardMiddleware)
  update(@Param('id') id: string, @Body() updateRequestDto, @Req() req) {
    const admin: User = req.user;
    return this.requestService.update(+id, updateRequestDto, admin);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestService.remove(+id);
  }
}
