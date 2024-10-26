import { Injectable } from '@nestjs/common';
import { OrderRequest, OrderResponse, OrderById, OrderStatus, OrderStatusRequest } from './../../interfaces/order.interface';
import { Observable, of } from 'rxjs';

@Injectable()
export class OrderService {
  private orders: OrderResponse[] = [];

  createOrder(orderRequest: OrderRequest): Observable<OrderResponse> {
    const newOrder: OrderResponse = { ...orderRequest, status: OrderStatus.ACCEPTED };
    this.orders.push(newOrder);
    return of(newOrder);
  }
}