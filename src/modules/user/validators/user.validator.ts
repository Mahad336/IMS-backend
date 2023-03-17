import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserValidator {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateCreateUserDto(dto: CreateUserDto): Promise<void> {
    const { email } = dto;

    const userExists = await this.userRepository.findOneBy({ email });

    if (userExists) {
      throw new Error(`User with email "${email}" already exists`);
    }
  }

  async validateUpdateUserDto(id: number, dto: UpdateUserDto): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new Error(`User with ID "${id}" not found`);
    }
  }
}
