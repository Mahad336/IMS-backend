import { User } from 'src/user/entities/user.entity';
export class CreateOrganizationDto {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly image: string;
  readonly bio: string;
  readonly address: string;
  readonly city: string;
  readonly country: string;
  readonly zip: number;
  readonly representativeName: string;
  readonly representativeContact: string;
  readonly user: User;
  readonly createdDate: Date;
  readonly updatedDate: Date;
}
