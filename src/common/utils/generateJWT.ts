import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/modules/role/entities/role.entity';

const generateToken = (
  payload: { id: string; role: Role },
  configService: ConfigService,
) => {
  return jwt.sign(payload, configService.get(<string>'secretKey'), {
    expiresIn: '2d',
  });
};

export { generateToken };
