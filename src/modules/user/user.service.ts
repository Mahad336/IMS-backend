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
import { ConfigService } from '@nestjs/config';
import { AbilityFactory, Action } from '../ability/ability.factory';
import { ForbiddenError } from '@casl/ability';
import { UserRole } from 'src/common/enums/user-role.enums';
import { CloudinaryService } from 'nestjs-cloudinary';
import { request } from 'http';
import { Item } from '../item/entities/item.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
    private abilityFactory: AbilityFactory,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(user: CreateUserDto, currUserRole, imageFile): Promise<User> {
    const newUserRole: any = currUserRole === UserRole.SUPER_ADMIN ? 2 : 3;
    const image = await this.uploadFile(imageFile);
    const genSalt = await bcrypt.genSalt();
    const newUser = this.userRepository.create({
      ...user,
      password: await bcrypt.hash(user.password, genSalt),
      role: newUserRole,
      roleId: newUserRole,
      organizationId: Number(user.organization),
      image,
    });

    const savedUser = await this.userRepository.save(newUser);

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
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'userorganization')
      .leftJoinAndSelect('user.item', 'useritem')
      .leftJoinAndSelect('useritem.category', 'itemcategory')
      .leftJoinAndSelect('useritem.subcategory', 'itemsubcategory')
      .leftJoinAndSelect('user.requests', 'request')
      .leftJoinAndSelect('request.item', 'item')
      .leftJoinAndSelect('item.category', 'category')
      .leftJoinAndSelect('item.subcategory', 'subcategory')
      .where('user.id = :id', { id })
      .getOne();
  }

  async update(id: number, updateUserDto: UpdateUserDto, req: any, imageFile) {
    const user = await this.userRepository.findOneByOrFail({ id });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    const image = imageFile ? await this.uploadFile(imageFile) : user.image;
    const genSalt = await bcrypt.genSalt();

    const updatedUser = this.userRepository.merge(user, {
      ...updateUserDto,
      password: await bcrypt.hash(updateUserDto.password, genSalt),
      image,
    });
    const result = await this.userRepository.update(id, updatedUser);

    return result;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    await this.userRepository.delete(id);
    return `User with ID ${id} has been deleted`;
  }

  async uploadFile(file) {
    const response = await this.cloudinaryService.uploadFile(file, {
      folder: 'ims/users',
      overwrite: true,
    });
    return response.secure_url;
  }
}
