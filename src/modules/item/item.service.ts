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
      relations: ['category', 'subcategory', 'organization', 'assignedTo'],
      where: { organization: { id: user?.organization.id } },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
