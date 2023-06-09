import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  ParseIntPipe,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ComplaintService } from './complaint.service';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import type { Multer } from 'multer';
import { User } from '../user/entities/user.entity';
import { Organization } from '../organization/entities/organization.entity';
import { Complaint } from './entities/complaint.entity';
import { AuthGuardMiddleware } from 'src/auth/guards/auth-guard.middleware';
import { UserRole } from 'src/common/enums/user-role.enums';
import { TransformComplaintDataInterceptor } from './interceptors/transform-complaint-data.interceptor';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { CheckAblities } from '../ability/decorators/abilities.decorators';
import { Action } from '../ability/ability.factory';

@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post()
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
  @CheckAblities({ action: Action.Create, subject: Complaint })
  @UseInterceptors(FilesInterceptor('attachments'))
  async create(
    @Body() createComplaintDto,
    @UploadedFiles() files,
    @Body('submittedBy', ParseIntPipe) submittedBy: User,
    @Body('organization', ParseIntPipe) organization: Organization,
  ) {
    return this.complaintService.create(
      {
        ...createComplaintDto,
        submittedBy,
        organization,
      },
      files,
    );
  }

  @Get()
  @UseGuards(AuthGuardMiddleware)
  @UseInterceptors(TransformComplaintDataInterceptor)
  async findAll(@Req() req): Promise<Complaint[]> {
    const user = req.user;
    switch (user?.role.name) {
      case UserRole.SUPER_ADMIN:
        return this.complaintService.getAllComplaints();
      case UserRole.ADMIN:
        return this.complaintService.getAdminComplaints(user);
      case UserRole.EMPLOYEE:
        return this.complaintService.getEmployeeComplaints(user);
      default:
        throw new HttpException('Invalid user role', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
  @CheckAblities({ action: Action.Read, subject: Complaint })
  findOne(@Param('id') id: string, @Req() req) {
    return this.complaintService.findOne(+id, req.user);
  }

  @Patch(':id')
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
  @CheckAblities({ action: Action.Update, subject: Complaint })
  update(@Param('id') id: string, @Body() updateComplaintDto, @Req() req) {
    return this.complaintService.update(+id, updateComplaintDto, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
  @CheckAblities({ action: Action.Delete, subject: Complaint })
  remove(@Param('id') id: string, @Req() req) {
    return this.complaintService.remove(+id, req.user);
  }
}
