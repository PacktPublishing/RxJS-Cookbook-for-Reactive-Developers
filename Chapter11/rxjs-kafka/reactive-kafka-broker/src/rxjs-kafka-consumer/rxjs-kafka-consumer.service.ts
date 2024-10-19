import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Consumer, ConsumerConfig, Kafka } from 'kafkajs';

@Injectable()
export class RxjsKafkaConsumerService implements OnApplicationShutdown {
    private readonly kafka: Kafka;
    private readonly consumers: Consumer[] = [];

    constructor() {
        // this.kafka = new Kafka({
        //   brokers: ['localhost:9092'], // Replace with your Kafka broker address
        //   retry: {
        //     retries: 0
        //   }
        // });
    }

    async consume(topic: any, config?: ConsumerConfig) {
        // console.log(topic)
        // const consumer = this.kafka.consumer({ groupId: 'my-group' });
        // await consumer.connect();
        // await consumer.subscribe({ topic: topic, fromBeginning: true });
        // await consumer.run({
        //     eachMessage: async ({ topic, partition, message }) => {
        //         console.log({
        //             topic,
        //             partition,
        //             value: message.value.toString(),
        //         });
        //     },
        // });
        // this.consumers.push(consumer);
    }

    async onApplicationShutdown() {
        await Promise.all(this.consumers.map(consumer => consumer.disconnect()));
    }
}
