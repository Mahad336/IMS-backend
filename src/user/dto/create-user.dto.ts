import { Role } from 'src/role/entities/role.entity';
import { Organization } from 'src/organization/entities/organization.entity';
export class CreateUserDto {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly passwordResetOtp?: string;
  readonly passwordResetExpiration?: Date;
  readonly contact: string;
  readonly image: string;
  readonly designation?: string;
  readonly department?: string;
  readonly education?: string;
  readonly companyExperience?: number;
  readonly totalExperience?: number;
  readonly role: Role;
  readonly organization: Organization;
  readonly createdDate: Date;
  readonly updatedDate: Date;
}
