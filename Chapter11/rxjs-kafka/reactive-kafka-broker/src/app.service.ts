import { Observable } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { MessageBrokerService } from './message-broker/message-broker.service';

@Injectable()
export class AppService {
  constructor(private messageBroker: MessageBrokerService) {}

  async getHello(): Promise<string> {
    await this.messageBroker.produce('my-topic', 'Hello from NestJS!');

    return 'Message sent to Kafka';
  }

}
