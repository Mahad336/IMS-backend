import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Not, Repository } from 'typeorm';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { Complaint } from './entities/complaint.entity';
import { CloudinaryService } from 'nestjs-cloudinary';
import { User } from '../user/entities/user.entity';
import { UserRole } from 'src/common/enums/user-role.enums';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectRepository(Complaint)
    private complaintRepository: Repository<Complaint>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async create(createComplaintDto: CreateComplaintDto, files) {
    const newComplaint = this.complaintRepository.create(createComplaintDto);
    const attachments: string[] =
      files && files.length > 0 ? await this.uploadFiles(files) : [];
    return await this.complaintRepository.save({
      ...newComplaint,
      attachments,
    });
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
        organization: { id: user.organizationId },
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

  async findOne(id: number, user: User) {
    const complaint = await this.complaintRepository.findOne({
      relations: ['submittedBy', 'organization'],
      where: { id },
    });
    if (!complaint) {
      throw new Error(`Complaint with ID ${id} not found`);
    }
    if (
      user.role.name === UserRole.EMPLOYEE &&
      complaint.submittedBy.id !== user.id
    ) {
      throw new UnauthorizedException(
        'You are not allowed to view complaint of any other user',
      );
    }
    if (
      user.role.name === UserRole.ADMIN &&
      complaint.organization.id !== user.organizationId
    ) {
      throw new UnauthorizedException(
        'You are not allowed to view detail of a user who does not belong to your organization',
      );
    }
    if (
      user.role.name === UserRole.ADMIN &&
      complaint.submittedBy.role.name !== UserRole.EMPLOYEE &&
      complaint.submittedBy.id !== user.id
    ) {
      throw new UnauthorizedException(
        `You can only see the complaints of Employee's`,
      );
    }
    return complaint;
  }

  async update(id: number, updateComplaintDto: UpdateComplaintDto, user) {
    const complaint = await this.complaintRepository.findOne({
      relations: ['submittedBy', 'organization'],
      where: { id },
    });
    if (!complaint) {
      throw new Error(`Complaint with ID ${id} not found`);
    }
    if (
      user.role.name === UserRole.EMPLOYEE &&
      complaint.submittedBy.id !== user.id
    ) {
      throw new UnauthorizedException(
        'You are not allowed to update complaint of any other user',
      );
    }
    if (
      user.role.name === UserRole.ADMIN &&
      complaint.organization.id !== user.organizationId
    ) {
      throw new UnauthorizedException(
        'You are not allowed to update detail of a user who does not belong to your organization',
      );
    }
    if (
      user.role.name === UserRole.ADMIN &&
      complaint.submittedBy.role.name! == UserRole.EMPLOYEE &&
      complaint.submittedBy.id !== user.id
    ) {
      throw new UnauthorizedException(
        `You can only update the complaints of Employee's`,
      );
    }
    return await this.complaintRepository.save({
      ...complaint,
      ...updateComplaintDto,
      actionBy: user.id,
      actionDateTime: new Date(),
    });
  }

  async remove(id: number, user: User) {
    const complaint = await this.complaintRepository.findOne({
      relations: ['submittedBy', 'organization'],
      where: { id },
    });
    if (!complaint) {
      throw new Error(`Complaint with ID ${id} not found`);
    }
    if (
      user.role.name === UserRole.EMPLOYEE &&
      complaint.submittedBy.id !== user.id
    ) {
      throw new UnauthorizedException(
        'You are not allowed to delete complaint of any other user',
      );
    }
    if (
      user.role.name === UserRole.ADMIN &&
      complaint.organization.id !== user.organizationId
    ) {
      throw new UnauthorizedException(
        'You are not allowed to delete the complaint of a user who does not belong to your organization',
      );
    }
    if (
      user.role.name === UserRole.ADMIN &&
      complaint.submittedBy.role.name! == UserRole.EMPLOYEE &&
      complaint.submittedBy.id !== user.id
    ) {
      throw new UnauthorizedException(
        `You can only delete the complaints of Employee's`,
      );
    }
    await this.complaintRepository.delete(id);
    return `Complaint with ID ${id} has been deleted`;
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
