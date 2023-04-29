import {
  ForbiddenException,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { generateToken } from 'src/common/utils/generateJWT';
import { ConfigService } from '@nestjs/config';
import { AbilityFactory, Action } from '../ability/ability.factory';
import { ForbiddenError } from '@casl/ability';
import { UserRole } from 'src/common/enums/user-role.enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
    private abilityFactory: AbilityFactory,
  ) {}

  async create(user: CreateUserDto, res: any): Promise<User> {
    const genSalt = await bcrypt.genSalt();
    const newUser = this.userRepository.create({
      ...user,
      password: await bcrypt.hash(user.password, genSalt),
    });
    const savedUser = await this.userRepository.save(newUser);
    const payload = { id: String(savedUser.id), role: savedUser.role };
    const token = generateToken(payload, this.configService);
    res.cookie('jwt', token, { maxAge: 3 * 24 * 60 * 60 * 1000 });

    return savedUser;
  }

  findAll(req) {
    // const user = req.user;
    // const ability = this.abilityFactory.defineAbility(user);

    // try {
    //   ForbiddenError.from(ability)
    //     .setMessage('hi Mahad congrats')
    //     .throwUnlessCan(Action.Read, User);
    // } catch (err) {
    //   if (err instanceof ForbiddenError)
    //     throw new ForbiddenException(err.message);
    // }

    const user = req.user;
    switch (user?.role.name) {
      case UserRole.SUPER_ADMIN:
        return this.userRepository.find({ where: { role: { name: 'admin' } } });
      case UserRole.ADMIN:
        return this.userRepository.find({
          where: { role: { name: 'employee' } },
        });
      case UserRole.EMPLOYEE:
        return this.userRepository.findOne({ where: { id: req.user.id } });
      default:
        throw new HttpException(
          'Not an authorized User',
          HttpStatus.UNAUTHORIZED,
        );
    }
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto, req: any) {
    const user = await this.userRepository.findOneBy({ id });
    const currUser = req.user;
    const ability = this.abilityFactory.defineAbility(currUser);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Update, user);
    } catch (err) {
      if (err instanceof ForbiddenError)
        throw new ForbiddenException(err.message);
    }

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
