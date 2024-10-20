import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { CompressionTypes, Consumer, ConsumerConfig, Kafka, Message } from 'kafkajs';
import { EMPTY, Observable, ReplaySubject, Subject, asyncScheduler, bufferTime, catchError, concatMap, delay, filter, groupBy, materialize, of, scan, subscribeOn, tap } from 'rxjs';

interface KafkaMessage {
    topic: string;
    compression: CompressionTypes;
    offset?: string;
    messages: { value: string }[];
    error?: Error;
}

interface KafkaConsumedMessage {
    topic: string;
    messages: { value: string }[];
}

@Injectable()
export class RxjsKafkaConsumerService implements OnModuleInit, OnApplicationShutdown {
    private readonly kafka: Kafka;
    private readonly consumers: Consumer[] = [];
    private readonly messages$ = new Subject<KafkaMessage>();
    private readonly dlq$ = new ReplaySubject<KafkaMessage>();

    constructor() {
        this.kafka = new Kafka({
          brokers: ['localhost:9092'], // Replace with your Kafka broker address
          retry: {
            retries: 0
          }
        });
    }

    async onModuleInit() {
        this.consumeMessages();
        this.dlq$.pipe(
            delay(5000),
            // send DLQ error to monitoring service every night at 2am
            subscribeOn(asyncScheduler),
            materialize(),
            tap(console.log)
        ).subscribe();
    }

    async consume(topics: string[], config?: ConsumerConfig) {
        const consumer = this.kafka.consumer({ groupId: 'my-group' });
        await consumer.connect();
        await consumer.subscribe({ topics, fromBeginning: true });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                // Step 2
                // console.log('consumed message', {
                //     topic,
                //     partition,
                //     offset: message.offset,
                //     value: message.value.toString(),
                // });
                const kafkaMessage = { 
                    topic, 
                    compression: CompressionTypes.GZIP, 
                    offset: message.offset, 
                    messages: [{ value: message.value.toString() }] 
                };
                let parsedMessage = null;
                
                try {
                    parsedMessage = this.deserializeMessage(kafkaMessage);
                } catch (error) {
                    this.dlq$.next({
                        topic: 'dlq',
                        compression: CompressionTypes.GZIP,
                        messages: [{ value: message.value.toString() }],
                        error
                    });
                    return;
                }

                this.messages$.next(parsedMessage);
            },
        });
        this.consumers.push(consumer);
    }

    async onApplicationShutdown() {
        await Promise.all(this.consumers.map(consumer => consumer.disconnect()));
    }

    deserializeMessage(kafkaMessage: KafkaMessage): KafkaConsumedMessage | Error {
        let parseMessages: { value: string }[];
        try {
            parseMessages = kafkaMessage.messages.map(x => JSON.parse(x.value));
        } catch (error) {
            // console.log('Error deserializing message: ', error);
            throw new Error(error);
        }

        return {
            ...kafkaMessage,
            messages: parseMessages,
        };
    }

    consumeMessages(): void {
        // Step 7
        // this.messages$.asObservable().pipe(
        //     groupBy(person => person.topic, { connector: () => new ReplaySubject(100) }),
        //     concatMap(group$ => group$.pipe(
        //         scan((acc, cur) => ({
        //             topic: group$.key,
        //             messages: acc.messages ? cur.messages.concat(acc.messages) : cur.messages,
        //         }), {} as KafkaConsumedMessage))
        //     ),
        //     catchError((error) => {
        //         console.log('Error consuming messages from Kafka!');
        //
        //         return EMPTY;
        //     }),
        //     tap(console.log),
        // ).subscribe();
        this.messages$.asObservable().pipe(
            bufferTime(1000),
            concatMap(messages => messages),
            groupBy(person => person.topic, { connector: () => new ReplaySubject(100) }),
            concatMap(group$ => group$.pipe(
                scan((acc, cur) => ({
                    topic: group$.key,
                    messages: acc.messages ? cur.messages.concat(acc.messages) : cur.messages,
                }), {} as KafkaConsumedMessage))
            ),
            catchError((error) => {
                console.log('Error consuming messages from Kafka!');
                this.dlq$.next({
                    topic: 'dlq',
                    compression: CompressionTypes.GZIP,
                    messages: [{ value: 'Error consuming messages from Kafka!' }],
                    error
                });

                return EMPTY;
            }),
            tap(console.log),
        ).subscribe();
    }
}
