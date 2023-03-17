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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
