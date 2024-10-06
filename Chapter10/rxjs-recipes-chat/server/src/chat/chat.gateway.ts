import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ReplaySubject, merge } from 'rxjs';
import { filter, map, scan, shareReplay } from 'rxjs/operators';
import * as WebSocket from 'ws';

export interface Message {
  event: string;
  data?: any;
}

@WebSocketGateway(8080)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: WebSocket.Server;

  private topics: { [topic: string]: ReplaySubject<{ id: string, message: string, clientId: string, timestamp: Date } | { typing: string }> } = {};
  
  @SubscribeMessage('connect')
  handleSubscribe(
    @MessageBody() topic: string,
    @ConnectedSocket() client: WebSocket,
  ): void {
    if (!this.topics[topic]) {
      this.topics[topic] = new ReplaySubject();
    }

    const source$ = this.topics[topic].pipe(shareReplay(1));

    const chat$ = source$.pipe(
      filter(data => 'message' in data),
      scan((acc, message) => [...acc, message], []),
      map(messages => ({ event: 'chat', data: messages })),
      shareReplay(1)
    );

    const typing$ = source$.pipe(
      filter(data => 'typing' in data),
      map((data: { typing: string }) => ({ event: 'chat', data: { clientId: data.typing } })),
    );

    const subscription = merge(chat$, typing$).subscribe(response => client.send(JSON.stringify(response)));

    client.on('close', () => subscription.unsubscribe());
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { topic: string, clientId: string, isTyping: boolean },
    @ConnectedSocket() client: WebSocket,
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

  handleConnection(client: WebSocket, ...args: any[]): void {
    const clientId = crypto.randomUUID();
    client.send(JSON.stringify({ event: 'connect', data: clientId }));
  }
  
  handleDisconnect(): void {

  }
}