import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { generateToken } from 'src/utils/generateJWT';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(user: User, res: any): Promise<User> {
    const genSalt = await bcrypt.genSalt();
    const newUser = this.userRepository.create({
      ...user,
      password: await bcrypt.hash(user.password, genSalt),
    });
    const savedUser = await this.userRepository.save(newUser);
    const token = generateToken(String(newUser.id));
    res.cookie('jwt', token, { maxAge: 3 * 24 * 60 * 60 * 1000 });

    return savedUser;
  }

  //login

  async login(body: User, res: any): Promise<User> {
    const { email, password } = body;
    const userExists = await this.userRepository.findOneBy({ email });

    if (userExists && (await bcrypt.compare(password, userExists.password))) {
      const token = generateToken(String(userExists.id));
      res.cookie('jwt', token, { maxAge: 3 * 24 * 60 * 60 * 1000 });
      return userExists;
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
