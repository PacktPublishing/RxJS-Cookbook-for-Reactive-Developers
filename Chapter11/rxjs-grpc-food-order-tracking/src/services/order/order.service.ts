import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  BehaviorSubject,
  delay,
  interval,
  map,
  merge,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { OrderRequest, OrderResponse, OrderStatus } from './../../interfaces/order.interface';

@Injectable()
export class OrderService implements OnModuleDestroy {
  private stop$ = new Subject<void>();

  onModuleDestroy() {
    // Clean up resources
    this.stop$.next();
  }

  createOrder(orderRequest: OrderRequest): Observable<OrderResponse> {
    const id = crypto.randomUUID();
    const newOrder: OrderResponse = { ...orderRequest, id, status: OrderStatus.PENDING };
    const orderStatus$ = new BehaviorSubject<OrderResponse>(newOrder);

    of(newOrder)
      .pipe(
        delay(1000),
        map((order: OrderResponse) => {
          order.status = OrderStatus.ACCEPTED;
          orderStatus$.next(order);
          return order;
        }),
        delay(1000),
        map((order: OrderResponse) => {
          order.status = OrderStatus.PREPARING;
          orderStatus$.next(order);
          return order;
        }),
        switchMap((order: OrderResponse) => {
          order.status = OrderStatus.COURIER_ON_THE_WAY;
          return interval(2000).pipe(
            map((i) => {
              const orderWithLocation = {
                ...order,
                location: {
                  lat: parseFloat((40.7128 + i * 0.1 + (Math.random() * 0.01 - 0.005)).toFixed(2)),
                  lng: parseFloat((-74.006 + i * 0.1 + (Math.random() * 0.01 - 0.005)).toFixed(2)),
                },
              };
              orderStatus$.next(orderWithLocation);
              return orderWithLocation;
            }),
            startWith({ ...order, location: { lat: 40.7128, lng: -74.006 } }),
            takeUntil(merge(timer(10001), this.stop$)),
          );
        }),
        delay(10000),
        map((order: OrderResponse) => {
          order.status = OrderStatus.DELIVERED;
          orderStatus$.next(order);
          return order;
        }),
        tap(() => orderStatus$.complete()),
        takeUntil(this.stop$),
      )
      .subscribe();

    return orderStatus$.asObservable();
  }
}
