import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'nestjs-cloudinary';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
    imageFile,
  ): Promise<Organization> {
    const image = imageFile ? await this.uploadFile(imageFile) : '';
    const newOrganization = this.organizationRepository.create({
      ...createOrganizationDto,
      image,
    });
    return await this.organizationRepository.save(newOrganization);
  }

  async findAll() {
    return await this.organizationRepository.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    return await this.organizationRepository.findOne({
      relations: ['user'],
      where: { id },
    });
  }

  async update(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
    imageFile,
  ) {
    const organization = this.organizationRepository.findOneBy({ id });
    if (!organization) {
      throw new Error(`Organization with ID ${id} is not found`);
    }
    const image = imageFile
      ? await this.uploadFile(imageFile)
      : (await organization).image;
    return this.organizationRepository.save({
      ...updateOrganizationDto,
      id,
      image,
    });
  }

  async remove(id: number) {
    const organization = await this.organizationRepository.findOneBy({ id });
    if (!organization) {
      throw new Error(`Organization with ID ${id} not found`);
    }
    await this.organizationRepository.delete(id);
    return `Organization with ID ${id} has been deleted`;
  }

  async uploadFile(file) {
    const response = await this.cloudinaryService.uploadFile(file, {
      folder: 'ims/organizations',
      overwrite: true,
    });
    return response.secure_url;
  }
}
