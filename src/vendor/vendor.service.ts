import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Repository } from 'typeorm';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Vendor } from './entities/vendor.entity';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor) private vendorRepository: Repository<Vendor>,
  ) {}
  async create(createVendorDto: CreateVendorDto): Promise<CreateVendorDto> {
    const newVendor = this.vendorRepository.create(createVendorDto);
    return await this.vendorRepository.save(newVendor);
  }

  async findAll() {
    return await this.vendorRepository.find({
      relations: ['categories'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} vendor`;
  }

  update(id: number, updateVendorDto: UpdateVendorDto) {
    return `This action updates a #${id} vendor`;
  }

  remove(id: number) {
    return `This action removes a #${id} vendor`;
  }
}
