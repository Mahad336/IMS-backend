import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Request } from './entities/request.entity';

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

  async findOne(id: number) {
    return await this.requestRepository.findOne({
      relations: ['item', 'submittedBy'],
      where: { id },
    });
  }

  async update(id: number, updateRequestDto: UpdateRequestDto, admin: any) {
    const request = await this.requestRepository.findOneBy({ id });
    console.log(request);
    if (!request) {
      throw new Error(`Request with ID ${id} not found`);
    }
    return await this.requestRepository.save({
      ...request,
      ...updateRequestDto,
      actionBy: admin.id,
      actionDateTime: new Date(),
    });
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}
