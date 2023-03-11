import { User } from 'src/user/entities/user.entity';
export class CreateRoleDto {
  readonly id: number;
  readonly name: string;
  readonly user: User;
  readonly createdDate: Date;
  readonly updatedDate: Date;
}
