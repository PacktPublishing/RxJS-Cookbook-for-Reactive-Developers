import { Injectable } from '@nestjs/common';
import { OrderRequest, OrderResponse, OrderById } from './../../interfaces/order.interface';
import { Observable, of } from 'rxjs';

@Injectable()
export class OrderService {
  private orders: OrderResponse[] = [];

  createOrder(orderRequest: OrderRequest): Observable<OrderResponse> {
    const newOrder: OrderResponse = { ...orderRequest, status: 'created' };
    this.orders.push(newOrder);
    return of(newOrder);
  }

  getOrder(orderById: OrderById): Observable<OrderResponse> {
    const order = this.orders.find(order => order.id === orderById.id);
    console.log('order', order)
    return of(order);
  }
}