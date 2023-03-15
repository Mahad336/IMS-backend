import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';

export class CreateRoleDto {
  @IsNotEmpty()
  readonly name: string;
}
