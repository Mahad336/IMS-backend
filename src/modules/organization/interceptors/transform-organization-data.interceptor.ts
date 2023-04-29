import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformOrganizationDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((organization) => ({
            id: organization.id,
            src: organization.image,
            name: organization.name,
            location: organization.address,
            email: organization.email,
            contact: organization.representativeContact,
          }));
        } else {
          return {
            id: data.id,
            src: data.image,
            name: data.name,
            location: data.address,
            email: data.email,
            contact: data.representativeContact,
          };
        }
      }),
    );
  }
}
