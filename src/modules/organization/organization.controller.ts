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
import { CheckAblities } from '../ability/decorators/abilities.decorators';
import { Action } from '../ability/ability.factory';
import { Organization } from './entities/organization.entity';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @CheckAblities({ action: Action.Create, subject: Organization })
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
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
  @CheckAblities({ action: Action.Read, subject: Organization })
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
  async findOne(@Param('id') id: string) {
    return await this.organizationService.findOne(+id);
  }

  @Patch(':id')
  @CheckAblities({ action: Action.Update, subject: Organization })
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
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
  @CheckAblities({ action: Action.Delete, subject: Organization })
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
  remove(@Param('id') id: string) {
    return this.organizationService.remove(+id);
  }
}
