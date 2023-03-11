import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthMiddleware } from './auth.middleware';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authMiddleware: AuthMiddleware) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return new Promise<boolean>((resolve, reject) => {
      this.authMiddleware.use(request, response, (err?: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}
