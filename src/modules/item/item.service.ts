import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
  ) {}
  async create(createItemDto: CreateItemDto) {
    return await this.itemRepository.save(
      this.itemRepository.create(createItemDto),
    );
  }

  async findAll(user: User) {
    return await this.itemRepository.find({
      relations: ['category', 'subcategory', 'organization'],
      where: { organization: { id: user?.organization.id } },
    });
  }

  async findOne(id: number) {
    return await this.itemRepository.findOne({
      relations: ['assignedTo', 'vendor'],
      where: {
        id,
      },
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const item = await this.itemRepository.findOneBy({ id });
    if (!item) {
      throw new Error(`Item with ID ${id} not found`);
    }
    return await this.itemRepository.save({ ...item, ...updateItemDto });
  }

  async remove(id: number) {
    const item = await this.itemRepository.findOneBy({ id });
    if (!item) {
      throw new Error(`Item with ID ${id} not found`);
    }
    await this.itemRepository.delete(id);
    return `Item with ID ${id} has been deleted`;
  }
}
