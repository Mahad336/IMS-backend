import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformItemDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return data.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          category: item.category?.name,
          subCategory: item.subcategory.name,
          price: item.currentPrice,
        }));
      }),
    );
  }
}
