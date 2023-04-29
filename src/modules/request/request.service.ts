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

  findOne(id: number) {
    return `This action returns a #${id} request`;
  }

  update(id: number, updateRequestDto: UpdateRequestDto) {
    return `This action updates a #${id} request`;
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}
