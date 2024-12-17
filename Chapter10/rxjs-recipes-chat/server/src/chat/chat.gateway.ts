import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { ChatConnectionService } from './chat-connection/chat-connection.service';
import { ChatService } from './chat.service';

@WebSocketGateway(8080, { pingTimeout: 2000 })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: WebSocket.Server;

  constructor(
    private chatConnectionService: ChatConnectionService,
    private chatService: ChatService,
  ) {}

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { topic: string; clientId: string; isTyping: boolean },
  ): void {
    const { topic, isTyping, clientId } = data;

    this.chatService.sendTopicMessage(topic, {
      clientId,
      isTyping,
    });
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { topic: string; message: string; clientId: string },
  ): void {
    const { topic, message, clientId } = data;

    this.chatService.sendTopicMessage(topic, {
      id: crypto.randomUUID(),
      message,
      clientId,
      timestamp: new Date(),
    });
  }

  handleConnection(@ConnectedSocket() client: WebSocket): void {
    this.chatConnectionService.handleClientConnection(client);
    const messages = this.chatService.latestMessages$.getValue();
    this.chatConnectionService.broadcastMessage({
      event: 'chat',
      data: messages,
    });
  }

  handleDisconnect(@ConnectedSocket() client: WebSocket): void {
    this.chatConnectionService.handleDisconnect(client);
  }
}
