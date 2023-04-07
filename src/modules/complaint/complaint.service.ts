import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { Complaint } from './entities/complaint.entity';
import { CloudinaryService } from 'nestjs-cloudinary';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectRepository(Complaint)
    private complaintRepository: Repository<Complaint>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async create(createComplaintDto: CreateComplaintDto) {
    console.log(createComplaintDto);
    const newComplaint = this.complaintRepository.create(createComplaintDto);
    return await this.complaintRepository.save(newComplaint);
  }

  findAll() {
    return this.complaintRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} complaint`;
  }

  update(id: number, updateComplaintDto: UpdateComplaintDto) {
    return `This action updates a #${id} complaint`;
  }

  remove(id: number) {
    return `This action removes a #${id} complaint`;
  }

  async uploadFiles(files) {
    return await Promise.all(
      files.map(async (file) => {
        const response = await this.cloudinaryService.uploadFile(file, {
          folder: 'ims/complaints',
          overwrite: true,
        });
        return response.secure_url;
      }),
    );
  }
}
