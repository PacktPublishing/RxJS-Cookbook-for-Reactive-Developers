import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ReplaySubject, Subscription, merge } from 'rxjs';
import { filter, map, scan, shareReplay, withLatestFrom } from 'rxjs/operators';
import * as WebSocket from 'ws';

export interface WsMessage {
  event: string;
  data?: any;
}

export interface Message { 
  id: string;
  message: string;
  clientId: string;
  timestamp: Date 
}

@WebSocketGateway(8080)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: WebSocket.Server;

  private topics: { [topicKey: string]: ReplaySubject<Message | { typing: string } | any> } = {
    chat: new ReplaySubject(100),
  };
  private chatSubscription: Subscription;
  
  constructor() {
    const chatTopic$ = this.topics['chat'].pipe(shareReplay({ bufferSize: 1, refCount: true }));

    const messages$ = chatTopic$.pipe(
      filter((data: WsMessage) => 'message' in data),
      scan((acc, message) => [...acc, message], []),
      map(messages => ({ event: 'chat', data: messages }))
    );

    const typing$ = chatTopic$.pipe(
      filter((data: { typing: string }) => 'typing' in data),
      map((data: { typing: string }) => ({ event: 'chat', data: { clientId: data.typing } })),
    );

    this.chatSubscription = merge(messages$, typing$).subscribe((response) => {
      this.server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(response));
        }

      });
    });    
  }
  
  @SubscribeMessage('connect')
  handleSubscribe(
    @MessageBody() topicKey: string,
  ): void {
    if (!this.topics[topicKey]) {
      this.topics[topicKey] = new ReplaySubject();
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { topic: string, clientId: string, isTyping: boolean },
  ): void {
    const { topic, isTyping, clientId } = data;

    if (this.topics[topic]) {
      this.topics[topic].next({
        typing: isTyping ? clientId : null
      });
    }
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { topic: string, message: string, clientId: string }
  ): void {
    const { topic, message, clientId } = data;

    if (this.topics[topic]) {
      this.topics[topic].next({
        id: crypto.randomUUID(),
        message,
        clientId,
        timestamp: new Date()
      });
    }
  }

  handleConnection(client: WebSocket): void {
    const clientId = crypto.randomUUID();
    client.id = clientId;
    client.send(JSON.stringify({ event: 'connect', data: { clientId, isOnline: true } }));
  }
  
  handleDisconnect(client: WebSocket): void {
    this.server.clients.forEach(c => {
      if (c.id === client.id) {
        c.close();
      } else {
        c.send(JSON.stringify({ event: 'connect', data: { clientId: client.id, isOnline: false } }));
      }
    });
  }
}