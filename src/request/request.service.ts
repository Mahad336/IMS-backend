import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findAll() {
    return await this.requestRepository.find();
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
