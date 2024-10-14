import { RxjsKafkaConsumerService } from './../rxjs-kafka-consumer/rxjs-kafka-consumer.service';
import { Module } from '@nestjs/common';
import { MessageBrokerService } from './message-broker.service';

@Module({
  providers: [MessageBrokerService, RxjsKafkaConsumerService],
  exports: [MessageBrokerService, RxjsKafkaConsumerService],
})
export class MessageBrokerModule {}
