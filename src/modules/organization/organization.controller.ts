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
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { AuthGuardMiddleware } from 'src/auth/guards/auth-guard.middleware';
import { TransformOrganizationDataInterceptor } from './interceptors/transform-organization-data.interceptor';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @UseGuards(AuthGuardMiddleware)
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Req() req: any,
  ) {
    if (req.user.role != 1) throw new UnauthorizedException();
    return this.organizationService.create(createOrganizationDto);
  }

  @Get()
  @UseInterceptors(TransformOrganizationDataInterceptor)
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(+id, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(+id);
  }
}
