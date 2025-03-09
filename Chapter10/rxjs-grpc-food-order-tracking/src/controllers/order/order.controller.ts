import { Controller, OnModuleDestroy } from '@nestjs/common';
import { GrpcStreamMethod } from '@nestjs/microservices';
import { Observable, Subject, mergeMap } from 'rxjs';
import { OrderService } from 'src/services/order/order.service';
import { OrderRequest, OrderResponse } from './../../interfaces/order.interface';

@Controller()
export class OrderController implements OnModuleDestroy {
  private orderStreamComplete = new Subject<boolean>();

  constructor(private readonly orderService: OrderService) {}

  onModuleDestroy() {
    this.orderStreamComplete.next(true);
  }

  @GrpcStreamMethod('FoodOrderService', 'CreateOrder')
  createOrder(stream: Observable<OrderRequest>): Observable<OrderResponse> {
    return stream.pipe(mergeMap((data: OrderRequest) => this.orderService.createOrder(data), 3));
  }
}
