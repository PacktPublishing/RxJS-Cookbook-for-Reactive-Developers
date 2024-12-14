import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { BehaviorSubject, Observable, ReplaySubject, Subscription, merge } from 'rxjs';
import { filter, map, scan, shareReplay, tap } from 'rxjs/operators';
import * as WebSocket from 'ws';
import { ChatService } from './chat.service';

export interface WsMessage<T> {
  event: string;
  data?: T;
}

export interface Message {
  id: string;
  message: string;
  clientId: string;
  timestamp: Date;
}

@WebSocketGateway(8080)
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: WebSocket.Server;

  private topics: {
    [topicKey: string]: ReplaySubject<Message | { typing: string } | any>;
  } = {
    chat: new ReplaySubject(100),
  };

  constructor(private chatService: ChatService) {}

  afterInit(): void {
    const chatTopic$ = this.topics['chat'].pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    const messages$ = chatTopic$.pipe(
      filter((data: WsMessage<string>) => 'message' in data),
      scan((acc, message) => [...acc, message], []),
      map((messages) => ({ event: 'chat', data: messages })),
    );

    const typing$ = chatTopic$.pipe(
      filter((data: { typing: string }) => 'typing' in data),
      map((data: { typing: string }) => ({
        event: 'chat',
        data: { clientId: data.typing },
      })),
    );

    merge(messages$, typing$).subscribe((response) => {
      this.server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(response));
        }
      });
    });
  }

  @SubscribeMessage('connect')
  handleSubscribe(@MessageBody() topicKey: string): Observable<WsResponse> {
    if (!this.topics[topicKey]) {
      this.topics[topicKey] = new ReplaySubject(100);
    }

    return this.topics[topicKey].asObservable().pipe(
      map((data) => ({ event: topicKey, data })),
    );
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { topic: string; clientId: string; isTyping: boolean },
  ): void {
    const { topic, isTyping, clientId } = data;

    if (this.topics[topic]) {
      this.topics[topic].next({
        typing: isTyping ? clientId : null,
      });
    }
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { topic: string; message: string; clientId: string },
  ): void {
    const { topic, message, clientId } = data;

    if (this.topics[topic]) {
      this.topics[topic].next({
        id: crypto.randomUUID(),
        message,
        clientId,
        timestamp: new Date(),
      });
    }
  }

  handleConnection(@ConnectedSocket() client: WebSocket): void {
    this.chatService.handleClientConnection(client);
  }

  handleDisconnect(@ConnectedSocket() client: WebSocket): void {
    this.chatService.handleDisconnect(client);
  }
}
