import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { CompressionTypes, Consumer, ConsumerConfig, Kafka } from 'kafkajs';
import { ReplaySubject, auditTime, bufferCount, bufferTime, catchError, concatMap, debounceTime, groupBy, last, map, mergeMap, of, reduce, sampleTime, scan, switchMap, tap, throttleTime, toArray } from 'rxjs';

interface KafkaMessage {
    topic: string;
    compression: CompressionTypes;
    offset: string;
    messages: { value: string }[];
}

interface KafkaConsumedMessage {
    topic: string;
    messages: { value: string }[];
}

@Injectable()
export class RxjsKafkaConsumerService implements OnApplicationShutdown {
    private readonly kafka: Kafka;
    private readonly consumers: Consumer[] = [];
    private readonly messages$ = new ReplaySubject<KafkaMessage>();

    constructor() {
        this.kafka = new Kafka({
          brokers: ['localhost:9092'], // Replace with your Kafka broker address
          retry: {
            retries: 0
          }
        });
        this.consumeMessages();
    }

    async consume(topics: string[], config?: ConsumerConfig) {
        const consumer = this.kafka.consumer({ groupId: 'my-group' });
        await consumer.connect();
        await consumer.subscribe({ topics, fromBeginning: true });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                this.messages$.next({
                    topic,
                    compression: CompressionTypes.GZIP,
                    offset: message.offset,
                    messages: [{ value: message.value.toString() }],
                });
            },
        });
        this.consumers.push(consumer);
    }

    async onApplicationShutdown() {
        await Promise.all(this.consumers.map(consumer => consumer.disconnect()));
    }

    consumeMessages() {
        return this.messages$.asObservable().pipe(
            bufferTime(1000),
            concatMap(messages => messages),
            groupBy(person => person.topic, { connector: () => new ReplaySubject(100) }),
            concatMap(group$ => group$.pipe(
                scan((acc, cur) => ({
                    topic: group$.key,
                    messages: acc.messages ? cur.messages.concat(acc.messages) : cur.messages,
                }), {} as KafkaConsumedMessage))
            ),
            tap(console.log),
        ).subscribe();
    }
}
