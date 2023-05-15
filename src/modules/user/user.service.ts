import {
  ForbiddenException,
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
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
    const image = imageFile ? await this.uploadFile(imageFile) : '';
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
          where: {
            role: { name: 'employee' },
            organizationId: user.organizationId,
          },
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

  async findOne(id: number, user: User): Promise<User> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'userorganization')
      .leftJoinAndSelect('user.item', 'useritem')
      .leftJoinAndSelect('useritem.category', 'itemcategory')
      .leftJoinAndSelect('useritem.subcategory', 'itemsubcategory')
      .leftJoinAndSelect('user.requests', 'request')
      .leftJoinAndSelect('request.item', 'item')
      .leftJoinAndSelect('item.category', 'category')
      .leftJoinAndSelect('item.subcategory', 'subcategory')
      .where('user.id = :id', { id });

    switch (user.role.name) {
      case UserRole.EMPLOYEE:
        queryBuilder.andWhere('user.id = :userId', { userId: user.id });
        break;
      case UserRole.ADMIN:
        queryBuilder
          .leftJoin('user.role', 'role')
          .andWhere(
            'role.name = :employeeRole AND user.organizationId = :organizationId',
            {
              employeeRole: UserRole.EMPLOYEE,
              organizationId: user.organizationId,
            },
          );
        break;
      case UserRole.SUPER_ADMIN:
        queryBuilder
          .leftJoin('user.role', 'role')
          .andWhere('role.name = :adminRole', { adminRole: UserRole.ADMIN });
        break;
      default:
        throw new UnauthorizedException(
          'You are not authorized to access this user detail.',
        );
    }

    const userDetail = await queryBuilder.getOne();

    if (!userDetail) {
      throw new UnauthorizedException(
        'You are not authorized to access this user detail.',
      );
    }

    return userDetail;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    user: User,
    imageFile,
  ): Promise<User> {
    const userDetail = await this.userRepository.findOneByOrFail({ id });

    if (!userDetail) {
      throw new Error(`User with ID ${id} not found`);
    }

    if (user.role.name === UserRole.EMPLOYEE && userDetail.id !== user.id) {
      throw new UnauthorizedException(
        "You are not authorized to update other user's profile",
      );
    }

    if (
      user.role.name === UserRole.ADMIN &&
      user.organizationId !== userDetail.organizationId
    ) {
      throw new UnauthorizedException(
        'You are not authorized to update profiles of users outside your organization',
      );
    }

    if (
      user.role.name === UserRole.SUPER_ADMIN &&
      userDetail.role.name === UserRole.SUPER_ADMIN
    ) {
      throw new UnauthorizedException(
        'You are not authorized to update Super Admin profile',
      );
    }

    const image = imageFile
      ? await this.uploadFile(imageFile)
      : userDetail.image;
    const genSalt = await bcrypt.genSalt();

    const updatedUser = this.userRepository.merge(userDetail, {
      ...updateUserDto,
      password: await bcrypt.hash(updateUserDto.password, genSalt),
      image,
    });

    return this.userRepository.save(updatedUser);
  }

  async remove(id: number, user: User) {
    const userDetail = await this.userRepository.findOneBy({ id });
    if (!userDetail) {
      throw new Error(`User with ID ${id} not found`);
    }

    switch (user.role.name) {
      case UserRole.EMPLOYEE:
        throw new UnauthorizedException(
          'You are not authorized to delete users',
        );
      case UserRole.ADMIN:
        if (user.organizationId !== userDetail.organizationId) {
          throw new UnauthorizedException(
            'You are not authorized to delete users from other organizations',
          );
        }
        if (userDetail.role.name !== UserRole.EMPLOYEE) {
          throw new UnauthorizedException(
            'You are only authorized to delete employees',
          );
        }
        break;
      case UserRole.SUPER_ADMIN:
        if (userDetail.role.name !== UserRole.ADMIN) {
          throw new UnauthorizedException(
            'You are only authorized to delete admins',
          );
        }
        break;
      default:
        throw new UnauthorizedException('Not an authorized user');
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
