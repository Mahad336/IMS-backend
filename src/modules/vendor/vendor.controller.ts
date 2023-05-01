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
  UseInterceptors,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { CheckAblities } from '../ability/decorators/abilities.decorators';
import { Action } from '../ability/ability.factory';
import { AuthGuardMiddleware } from 'src/auth/guards/auth-guard.middleware';
import { Vendor } from './entities/vendor.entity';
import { AbilitiesGuard } from '../ability/guards/abilities.guard';
import { TransformVendorDataInterceptor } from './interceptors/transform-vendor-data.interceptor';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.create(createVendorDto);
  }

  @Get()
  @CheckAblities({ action: Action.Read, subject: Vendor })
  @UseGuards(AuthGuardMiddleware, AbilitiesGuard)
  @UseInterceptors(TransformVendorDataInterceptor)
  findAll(@Req() req) {
    const user = req.user;
    return this.vendorService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorService.update(+id, updateVendorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorService.remove(+id);
  }
}
