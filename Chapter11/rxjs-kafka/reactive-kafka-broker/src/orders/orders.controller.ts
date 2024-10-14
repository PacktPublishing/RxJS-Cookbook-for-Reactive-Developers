import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get('random-recipe')
  getRandomRecipe(): Observable<any> {
    return this.ordersService.getRandomRecipe$();
  }
}
