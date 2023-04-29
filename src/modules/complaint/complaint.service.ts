import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Not, Repository } from 'typeorm';
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
    const newComplaint = this.complaintRepository.create(createComplaintDto);
    return await this.complaintRepository.save(newComplaint);
  }

  async getAllComplaints(): Promise<Complaint[]> {
    return this.complaintRepository.find({
      relations: ['submittedBy', 'organization'],
      where: { submittedBy: { roleId: 2 } },
      order: { createdDate: 'DESC' },
    });
  }

  async getAdminComplaints(user: any): Promise<any> {
    const organizationId = user.organization.id;

    const receivedComplaints = await this.complaintRepository.find({
      relations: ['organization', 'submittedBy'],
      where: {
        organization: { id: organizationId },
        submittedBy: { id: Not(Equal(user.id)) },
      },
      order: { createdDate: 'DESC' },
    });

    const submittedComplaints = await this.complaintRepository.find({
      relations: ['submittedBy'],
      where: {
        submittedBy: { id: user.id },
      },
      order: { createdDate: 'DESC' },
    });

    return { receivedComplaints, submittedComplaints };
  }

  async getEmployeeComplaints(user: any): Promise<Complaint[]> {
    return this.complaintRepository.find({
      relations: ['submittedBy', 'organization'],
      where: { submittedBy: { id: user?.id } },
      order: { createdDate: 'DESC' },
    });
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
