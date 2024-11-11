import { Controller, OnModuleDestroy } from '@nestjs/common';
import { GrpcStreamMethod } from '@nestjs/microservices';
import { Observable, ReplaySubject, Subject, delay, finalize, interval, map, startWith, switchMap, takeLast, takeUntil, timer } from 'rxjs';
import { OrderService } from 'src/services/order/order.service';
import { OrderRequest, OrderResponse, OrderStatus } from './../../interfaces/order.interface';

@Controller()
export class OrderController implements OnModuleDestroy {
  private orderStatus = new ReplaySubject<OrderResponse>(1);
  private orderStreamComplete = new Subject<boolean>();
  
  constructor(private readonly orderService: OrderService) { }

  onModuleDestroy() {
    this.orderStreamComplete.next(true);
  }

  @GrpcStreamMethod('FoodOrderService', 'CreateOrder')
  createOrder(stream: Observable<OrderRequest>): Observable<OrderResponse> {
    stream.pipe(
      switchMap((data: OrderRequest) => this.orderService.createOrder(data)),
      delay(1000),
      map((order: OrderResponse) => {
        order.status = OrderStatus.ACCEPTED;
        this.orderStatus.next(order);
        return order;
      }),
      delay(1000),
      map((order: OrderResponse) => {
        order.status = OrderStatus.PREPARING;
        this.orderStatus.next(order);
        return order;
      }),
      delay(5000),
      switchMap((order: OrderResponse) => {
        order.status = OrderStatus.COURIER_ON_THE_WAY;

        return interval(2000).pipe(
          map(i => {
            const orderWithLocation = {
              ...order,
              location: { 
                lat: parseFloat((40.7128 + i * 0.1 + (Math.random() * 0.01 - 0.005)).toFixed(2)), 
                lng: parseFloat((-74.0060 + i * 0.1 + (Math.random() * 0.01 - 0.005)).toFixed(2)) 
              }
            };
            this.orderStatus.next(orderWithLocation);

            return orderWithLocation;
          }),
          startWith({ ...order, location: { lat: 40.7128, lng: -74.0060 } }),
          takeUntil(timer(10001)),
          takeLast(1) // Take only the last emission
        );
      }),
      map((order: OrderResponse) => {
        order.status = OrderStatus.DELIVERED;
        this.orderStatus.next(order);
        return order;
      }),
      takeUntil(this.orderStreamComplete)
    ).subscribe();

    return this.orderStatus.asObservable().pipe(
      finalize(() => this.orderStatus.complete())
    );
  }
}