import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Category } from 'src/modules/category/entities/category.entity';
import { Complaint } from 'src/modules/complaint/entities/complaint.entity';
import { Item } from 'src/modules/item/entities/item.entity';
import { Organization } from 'src/modules/organization/entities/organization.entity';
import { Request } from 'src/modules/request/entities/request.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Vendor } from 'src/modules/vendor/entities/vendor.entity';
import { ConfigService } from '@nestjs/config';

export default async function getConfig(
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> {
  return {
    type: configService.get<'postgres'>('DB_TYPE'),
    host: configService.get('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
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
  };
}
