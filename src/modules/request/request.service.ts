import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Request } from './entities/request.entity';
import { UserRole } from 'src/common/enums/user-role.enums';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request) private requestRepository: Repository<Request>,
  ) {}
  async create(createRequestDto: CreateRequestDto) {
    return await this.requestRepository.save(
      this.requestRepository.create(createRequestDto),
    );
  }

  async getEmployeeRequests(user: User, type?: string): Promise<Request[]> {
    const where: any = { submittedBy: { id: user?.id } };
    where.type = type
      ? type === 'return'
        ? In(['repaired', 'replaced'])
        : type
      : undefined;
    return await this.requestRepository.find({
      relations: ['submittedBy', 'item', 'organization'],
      where,
      order: { createdDate: 'DESC' },
    });
  }

  async getAdminRequests(user: User, type?: string): Promise<Request[]> {
    const where: any = {
      organization: { id: user?.organization?.id },
    };
    where.type = type
      ? type === 'return'
        ? In(['Repaired', 'Replaced'])
        : type
      : undefined;
    return await this.requestRepository.find({
      relations: ['organization', 'submittedBy', 'item'],
      where,
      order: { createdDate: 'DESC' },
    });
  }

  async findOne(id: number, user?: User): Promise<Request> {
    const queryBuilder = this.requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.item', 'item')
      .leftJoinAndSelect('item.category', 'category')
      .leftJoinAndSelect('item.subcategory', 'subcategory')
      .leftJoinAndSelect('request.submittedBy', 'user')
      .where('request.id = :id', { id });

    if (user?.role.name === UserRole.EMPLOYEE) {
      queryBuilder.andWhere('user.id = :userId', { userId: user.id });
    } else if (user?.role.name === UserRole.ADMIN) {
      queryBuilder
        .leftJoin('user.organization', 'org')
        .andWhere('org.id = :organizationId', {
          organizationId: user.organization.id,
        });
    } else {
      throw new UnauthorizedException('Not an Authorized User');
    }

    const request = await queryBuilder.getOne();

    if (!request) {
      throw new NotFoundException('Request Not Found');
    }

    return request;
  }

  async update(id: number, updateRequestDto: UpdateRequestDto, user) {
    const request = await this.requestRepository.findOne({
      relations: ['organization'],
      where: { id },
    });

    if (!request) {
      throw new Error(`Request with ID ${id} not found`);
    }

    if (
      user.role.name === UserRole.EMPLOYEE &&
      request.submittedBy.id !== user.id
    ) {
      throw new UnauthorizedException(
        'You are not authorized to update this request',
      );
    }

    if (
      user.role.name === UserRole.ADMIN &&
      request.organization.id !== user.organization.id
    ) {
      throw new UnauthorizedException(
        'You are not authorized to update this request',
      );
    }

    return await this.requestRepository.save({
      ...request,
      ...updateRequestDto,
      actionBy: user.id,
      actionDateTime: new Date(),
    });
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}
