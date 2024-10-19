import { Observable } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { MessageBrokerService } from './message-broker/message-broker.service';
import { RxjsKafkaConsumerService } from './rxjs-kafka-consumer/rxjs-kafka-consumer.service';

@Injectable()
export class AppService {
  constructor(private messageBroker: MessageBrokerService, private rxjsKafkaSocumer: RxjsKafkaConsumerService) {
    this.rxjsKafkaSocumer.consume('my-topic');
  }

  async getHello(): Promise<string> {
    await this.messageBroker.produce('my-topic', 'Hello from NestJS!');

    return 'Message sent to Kafka';
  }

}