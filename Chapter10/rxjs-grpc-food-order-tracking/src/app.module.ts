import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderService } from './services/order/order.service';
import { OrderController } from './controllers/order/order.controller';

@Module({
  imports: [],
  controllers: [AppController, OrderController],
  providers: [AppService, OrderService],
})
export class AppModule {}
