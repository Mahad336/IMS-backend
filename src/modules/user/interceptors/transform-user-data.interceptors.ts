import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserRole } from 'src/common/enums/user-role.enums';

@Injectable()
export class TransformUserDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const role = request?.user?.role.name;

    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          if (role === UserRole.SUPER_ADMIN) {
            return data.map((admin) => ({
              id: admin.id,
              src: admin.image,
              name: admin.name,
              organization: admin.organization?.name,
              email: admin.email,
              contact: admin.contact,
            }));
          } else if (role === UserRole.ADMIN) {
            return data.map((employee) => ({
              id: employee.id,
              name: employee.name,
              email: employee.email,
              contact: employee.contact,
              department: employee.department,
            }));
          }
        } else {
          console.log('acha ggggg');
          if (role === UserRole.SUPER_ADMIN) {
            return {
              id: data.id,
              src: data.image,
              name: data.name,
              organization: data.organization?.name,
              email: data.email,
              contact: data.contact,
            };
          } else if (role === UserRole.ADMIN) {
            return {
              id: data.id,
              name: data.name,
              email: data.email,
              contact: data.contact,
              department: data.department,
            };
          } else if (role === UserRole.EMPLOYEE) {
            return {
              id: data.id,
              image: data.image,
              name: data.name,
              email: data.email,
              designation: data.designation,
              department: data.department,
              contact: data.contact,
              education: data.education,
              companyExperience: data.companyExperience,
              totalExperience: data.totalExperience,
            };
          }
        }
      }),
    );
  }
}
