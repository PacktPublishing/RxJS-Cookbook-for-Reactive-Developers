import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka, Producer } from 'kafkajs';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class MessageBrokerService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      brokers: ['localhost:9092'], // Replace with your Kafka broker address
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'my-group' });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'my-topic', fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({  

          value: message.value.toString(),  

        });
      },
    });
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async produce(topic: string, message: string) {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
  }

  // subscribe<T>(topic: string): Observable<T> {
  //   if (!this.topics.has(topic)) {
  //     this.topics.set(topic, new ReplaySubject<T>());
  //   }
  //   return this.topics.get(topic).asObservable();
  // }
}
