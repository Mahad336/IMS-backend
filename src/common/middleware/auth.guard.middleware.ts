import {
  Injectable,
  NestMiddleware,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/modules/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuardMiddleware implements NestMiddleware, CanActivate {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.jwt;
      if (token) {
        const decodedToken: any = jwt.verify(
          token,
          this.configService.get(<string>'secretKey'),
        );
        let user = await this.userRepository.findOne({
          where: { id: decodedToken.id },
        });
        req['user'] = user;
        next();
      } else {
        next();
        throw new UnauthorizedException();
      }
    } catch (error) {
      console.log(error.message);
      throw new UnauthorizedException();
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return new Promise<boolean>((resolve, reject) => {
      this.use(request, response, (err?: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}
