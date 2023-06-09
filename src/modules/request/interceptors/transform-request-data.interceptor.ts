import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { formatDate } from 'src/utils/formattedDate';

@Injectable()
export class TransformRequestDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return data.map((request) => ({
          id: request.id,
          itemName: request?.item?.name,
          category: request?.item?.category?.name,
          subCategory: request?.item?.subcategory?.name,
          type: request?.type,
          submissionDate: formatDate(request?.createdDate),
          status: request?.status,
        }));
      }),
    );
  }
}
