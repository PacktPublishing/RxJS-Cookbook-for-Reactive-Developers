import { Test, TestingModule } from '@nestjs/testing';
import { ChatConnectionService } from './chat-connection.service';

describe('ChatConnectionService', () => {
  let service: ChatConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatConnectionService],
    }).compile();

    service = module.get<ChatConnectionService>(ChatConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
