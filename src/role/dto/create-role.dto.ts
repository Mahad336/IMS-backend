import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateRoleDto {
  readonly id: number;

  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  readonly user?: User;

  @IsOptional()
  readonly createdDate?: Date;

  @IsOptional()
  readonly updatedDate?: Date;
}
