import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { generateToken } from 'src/common/utils/generateJWT';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async create(user: CreateUserDto, res: any): Promise<User> {
    const genSalt = await bcrypt.genSalt();
    const newUser = this.userRepository.create({
      ...user,
      password: await bcrypt.hash(user.password, genSalt),
    });
    const savedUser = await this.userRepository.save(newUser);
    const token = generateToken(String(newUser.id), this.configService);
    res.cookie('jwt', token, { maxAge: 3 * 24 * 60 * 60 * 1000 });

    return savedUser;
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    const genSalt = await bcrypt.genSalt();
    return await this.userRepository.save({
      ...user,
      ...updateUserDto,
      password: await bcrypt.hash(user.password, genSalt),
    });
  }

  async remove(id: number) {
    return await this.userRepository.delete({ id });
  }
}
