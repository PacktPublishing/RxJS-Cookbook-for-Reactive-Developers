import { Test, TestingModule } from '@nestjs/testing';
import { RxjsKafkaConsumerService } from './rxjs-kafka-consumer.service';

describe('RxjsKafkaConsumerService', () => {
  let service: RxjsKafkaConsumerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RxjsKafkaConsumerService],
    }).compile();

    service = module.get<RxjsKafkaConsumerService>(RxjsKafkaConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
