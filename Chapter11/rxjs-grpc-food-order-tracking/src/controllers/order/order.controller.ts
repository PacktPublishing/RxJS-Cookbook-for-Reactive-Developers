import { Controller } from '@nestjs/common';
import { GrpcStreamMethod } from '@nestjs/microservices';
import { Observable, Subject, switchMap, tap } from 'rxjs';
import { OrderService } from 'src/services/order/order.service';
import { OrderById, OrderRequest, OrderResponse } from './../../interfaces/order.interface';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @GrpcStreamMethod('FoodOrderService', 'CreateOrder')
  createOrder(stream: Observable<OrderRequest>): Observable<OrderResponse> {
    return stream.pipe(
      tap((data) => console.log('data', data)),
      switchMap((data) => this.orderService.createOrder(data))
    );
  }

  @GrpcStreamMethod('FoodOrderService', 'GetOrder')
  getOrder(stream: Observable<OrderById>): Observable<OrderResponse> {
    return stream.pipe(
      tap((id: OrderById) => console.log('id', id)),
      switchMap((id: OrderById) => this.orderService.getOrder(id))
    );
  }
}