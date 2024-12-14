import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatConnectionService } from './chat-connection/chat-connection.service';

@Module({
  providers: [ChatGateway, ChatService, ChatConnectionService],
})
export class ChatModule {}
