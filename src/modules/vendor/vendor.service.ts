import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/modules/category/entities/category.entity';
import { In, Repository } from 'typeorm';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Vendor } from './entities/vendor.entity';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor) private vendorRepository: Repository<Vendor>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(createVendorDto: CreateVendorDto): Promise<CreateVendorDto> {
    const categories = await this.categoryRepository.findBy({
      id: In(createVendorDto.categories),
    });
    const subcategories = await this.categoryRepository.findBy({
      id: In(createVendorDto.subcategories),
    });

    const newVendor = this.vendorRepository.create({
      ...createVendorDto,
      categories,
      subcategories,
    });
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
