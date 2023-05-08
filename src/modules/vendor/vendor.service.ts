import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/modules/category/entities/category.entity';
import { In, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
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

  async findAll(user: User) {
    return await this.vendorRepository.find({
      relations: ['organization', 'categories', 'subcategories', 'items'],
      where: {
        organization: { id: user?.organization?.id },
      },
    });
  }

  async findOne(id: number) {
    return await this.vendorRepository.findOne({
      relations: ['categories', 'subcategories', 'items'],
      where: { id },
    });
  }

  async update(id: number, updateVendorDto: UpdateVendorDto) {
    const vendor = await this.vendorRepository.findOneBy({ id });
    if (!vendor) {
      throw new Error(`Vendor with ID ${id} not found`);
    }

    const categories = await this.categoryRepository.findBy({
      id: In(updateVendorDto.categories),
    });
    const subcategories = await this.categoryRepository.findBy({
      id: In(updateVendorDto.subcategories),
    });

    return await this.vendorRepository.save({
      ...vendor,
      ...updateVendorDto,
      categories,
      subcategories,
    });
  }

  async remove(id: number) {
    const vendor = await this.vendorRepository.findOneBy({ id });
    if (!vendor) {
      throw new Error(`Vendor with ID ${id} not found`);
    }
    await this.vendorRepository.delete(id);
    return `Vendor with ID ${id} has been deleted`;
  }
}
