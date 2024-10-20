import { Injectable } from '@nestjs/common';
import { MessageBrokerService } from './message-broker/message-broker.service';
import { RxjsKafkaConsumerService } from './rxjs-kafka-consumer/rxjs-kafka-consumer.service';

export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
}

@Injectable()
export class AppService {
  constructor(private messageBroker: MessageBrokerService, private rxjsKafkaSocumer: RxjsKafkaConsumerService) {
    this.rxjsKafkaSocumer.consume(['recipes-topic']);
  }

  async getHello(recipe: string): Promise<string> {
    await this.messageBroker.produce('recipes-topic', recipe);

    return 'Message sent to Kafka recipes-topic';
  }

}
