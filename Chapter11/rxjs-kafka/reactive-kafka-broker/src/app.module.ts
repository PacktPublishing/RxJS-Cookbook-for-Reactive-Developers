import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { MessageBrokerModule } from './message-broker/message-broker.module';
import { RecipesModule } from './recipes/recipes.module';
import { RxjsKafkaConsumerService } from './rxjs-kafka-consumer/rxjs-kafka-consumer.service';

@Module({
  imports: [
  //   ClientsModule.register([
  //     {
  //       name: 'RECIPE_SERVICE',
  //       transport: Transport.TCP,
  //       options: {
  //         host: 'localhost',
  //         port: 3001,
  //       },
  //     },
  //     {
  //       name: 'ORDER_SERVICE',
  //       transport: Transport.TCP,
  //       options: {
  //         host: 'localhost',
  //         port: 3002,
  //       },
  //     },
  //   ]),
    MessageBrokerModule,
    RecipesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
