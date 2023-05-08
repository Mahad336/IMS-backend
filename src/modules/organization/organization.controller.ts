import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { AuthGuardMiddleware } from 'src/auth/guards/auth-guard.middleware';
import { TransformOrganizationDataInterceptor } from './interceptors/transform-organization-data.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @UseGuards(AuthGuardMiddleware)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createOrganizationDto,
    @UploadedFile() imageFile,
    @Req() req: any,
  ) {
    if (req.user.role.id != 1) throw new UnauthorizedException();
    return this.organizationService.create(createOrganizationDto, imageFile);
  }

  @Get()
  @UseInterceptors(TransformOrganizationDataInterceptor)
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.organizationService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuardMiddleware)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto,
    @UploadedFile() imageFile,
    @Req() req: any,
  ) {
    if (req.user.role.id != 1) throw new UnauthorizedException();
    return this.organizationService.update(
      +id,
      updateOrganizationDto,
      imageFile,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(+id);
  }
}
