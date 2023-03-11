import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Organization } from 'src/organization/entities/organization.entity';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'mahad',
  password: 'admin123',
  database: 'ims',
  entities: [User, Role, Organization],
  synchronize: true,
  logging: true,
};

export default config;
