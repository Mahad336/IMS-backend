import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformVendorDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return data.map((vendor) => ({
          id: vendor.id,
          name: vendor.name,
          contact: vendor?.contact,
          category: vendor?.categories?.map((cat) => cat.name).join(','),
          subcategory: vendor?.subcategories?.map((cat) => cat.name).join(','),
          totalSpending: vendor?.items
            .map((item) => item.currentPrice)
            .reduce((acc, currValue) => acc + currValue, 0),
        }));
      }),
    );
  }
}
