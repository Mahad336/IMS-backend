import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

const generateToken = (id: string, configService: ConfigService) => {
  return jwt.sign({ id }, configService.get(<string>'secretKey'), {
    expiresIn: '2d',
  });
};

export { generateToken };
