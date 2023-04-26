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

@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('attachments'))
  async create(
    @Body() createComplaintDto,
    @UploadedFiles() files,
    @Body('submittedBy', ParseIntPipe) submittedBy: User,
    @Body('organization', ParseIntPipe) organization: Organization,
  ) {
    const attachments = await this.complaintService.uploadFiles(files);

    return this.complaintService.create({
      ...createComplaintDto,
      submittedBy,
      organization,
      attachments,
    });
  }

  @Get()
  @UseGuards(AuthGuardMiddleware)
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
  findOne(@Param('id') id: string) {
    return this.complaintService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateComplaintDto: UpdateComplaintDto,
  ) {
    return this.complaintService.update(+id, updateComplaintDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.complaintService.remove(+id);
  }
}
