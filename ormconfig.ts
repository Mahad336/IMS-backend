import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Complaint } from 'src/complaint/entities/complaint.entity';
import { Item } from 'src/item/entities/item.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { Request } from 'src/request/entities/request.entity';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'mahad',
  password: 'admin123',
  database: 'ims',
  entities: [
    User,
    Role,
    Organization,
    Category,
    Vendor,
    Request,
    Item,
    Complaint,
  ],
  synchronize: true,
  logging: true,
};

export default config;
