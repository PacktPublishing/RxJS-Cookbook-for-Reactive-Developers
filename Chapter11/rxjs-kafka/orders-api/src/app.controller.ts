import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('orders')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Observable<string> {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'createOrder' })
  async createOrder(data: any) {
    // Handle the order creation...

    return { status: 'success' };
  }
}
