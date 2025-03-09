import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { FoodOrderService } from './food-order/food-order.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Path to the static files
    }),
  ],
  controllers: [AppController],
  providers: [AppService, FoodOrderService],
})
export class AppModule {}
