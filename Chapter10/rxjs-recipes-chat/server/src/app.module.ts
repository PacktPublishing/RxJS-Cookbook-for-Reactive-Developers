import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ChatConnectionService } from './chat/chat-connection/chat-connection.service';

@Module({
  imports: [ChatModule],
  controllers: [AppController],
  providers: [AppService, ChatConnectionService],
})
export class AppModule {}
