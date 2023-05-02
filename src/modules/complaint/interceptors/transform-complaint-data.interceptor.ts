import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserRole } from 'src/common/enums/user-role.enums';
import { formatDate } from 'src/utils/formattedDate';

@Injectable()
export class TransformComplaintDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const isAdmin =
          context.switchToHttp().getRequest().user.role.name === UserRole.ADMIN;
        const isSuperAdmin =
          context.switchToHttp().getRequest().user.role.name ===
          UserRole.SUPER_ADMIN;

        if (isAdmin) {
          return {
            receivedComplaints: data.receivedComplaints?.map((complaint) => ({
              id: complaint.id,
              employeeName: complaint?.submittedBy?.name,
              organization: complaint?.organization?.name,
              description: complaint?.description,
              submissionDate: formatDate(complaint?.createdDate),
              status: complaint?.status,
            })),
            submittedComplaints: data.submittedComplaints?.map((complaint) => ({
              id: complaint.id,
              title: complaint.title,
              description: complaint.description,
              subDate: formatDate(complaint.createdDate),
              status: complaint.status,
            })),
          };
        } else if (isSuperAdmin) {
          return data.map((complaint) => ({
            id: complaint.id,
            adminName: complaint?.submittedBy?.name,
            organization: complaint?.organization?.name,
            description: complaint?.description,
            submissionDate: formatDate(complaint?.createdDate),
            status: complaint?.status,
          }));
        } else {
          return data.map((complaint) => ({
            id: complaint.id,
            title: complaint.title,
            description: complaint.description,
            subDate: formatDate(complaint.createdDate),
            status: complaint.status,
          }));
        }
      }),
    );
  }
}
