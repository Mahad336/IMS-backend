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
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ComplaintService } from './complaint.service';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import type { Multer } from 'multer';
import { User } from '../user/entities/user.entity';
import { Organization } from '../organization/entities/organization.entity';

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
  findAll() {
    return this.complaintService.findAll();
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
