import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async findOne(id: number, user: User) {
    const item = await this.itemRepository.findOne({
      relations: ['assignedTo', 'vendor', 'organization'],
      where: {
        id,
      },
    });
    if (item.organization.id !== user.organizationId) {
      throw new UnauthorizedException(
        'You are not allowed to view detail of item other than your own organizaion',
      );
    }
    return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto, user: User) {
    const item = await this.itemRepository.findOne({
      relations: ['organization'],
      where: { id },
    });
    if (item.organizationId !== user.organizationId) {
      throw new UnauthorizedException(
        'You are now allowed to update Item from other organization',
      );
    }

    if (!item) {
      throw new Error(`Item with ID ${id} not found`);
    }

    return await this.itemRepository.save({ ...item, ...updateItemDto });
  }

  async remove(id: number, user: User) {
    const item = await this.itemRepository.findOne({
      relations: ['organization'],
      where: { id },
    });
    if (item.organization.id !== user.organizationId) {
      throw new UnauthorizedException(
        'You are now allowed to delete Item from other organization',
      );
    }

    if (!item) {
      throw new Error(`Item with ID ${id} not found`);
    }
    await this.itemRepository.delete(id);
    return `Item with ID ${id} has been deleted`;
  }
}
