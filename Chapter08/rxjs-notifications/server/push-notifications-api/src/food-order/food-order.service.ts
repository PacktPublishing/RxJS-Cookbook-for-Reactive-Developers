import { Injectable } from '@nestjs/common';
import { Observable, of, delay } from 'rxjs';
import { orderNotification, OrderStatus } from 'src/notification';

@Injectable()
export class FoodOrderService {
  processOrder(): Observable<string> {
    return of(orderNotification[OrderStatus.DELIVERED]).pipe(delay(5000));
  }
}
