import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ReplaySubject, merge } from 'rxjs';
import { filter, map, scan, shareReplay } from 'rxjs/operators';
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

  private topics: { [topicKey: string]: ReplaySubject<Message | { typing: string } | any> } = {};
  
  @SubscribeMessage('connect')
  handleSubscribe(
    @MessageBody() topicKey: string,
    @ConnectedSocket() client: WebSocket,
  ): void {
    if (!this.topics[topicKey]) {
      this.topics[topicKey] = new ReplaySubject();
    }

    const topics$ = this.topics[topicKey].pipe(shareReplay(1));

    const chat$ = topics$.pipe(
      filter(data => 'message' in data),
      scan((acc, message) => [...acc, message], []),
      map(messages => ({ event: 'chat', data: messages }))
    );

    const typing$ = topics$.pipe(
      filter(data => 'typing' in data),
      map((data: { typing: string }) => ({ event: 'chat', data: { clientId: data.typing } })),
    );

    const subscription = merge(chat$, typing$).subscribe(response => client.send(JSON.stringify(response)));

    client.on('close', () => subscription.unsubscribe());
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

  handleConnection(client: WebSocket, ...args: any[]): void {
    const clientId = crypto.randomUUID();
    client.send(JSON.stringify({ event: 'connect', data: clientId }));
    // this.topics['connection'].next({ id: clientId, timestamp: new Date() });
  }
  
  handleDisconnect(client: WebSocket): void {
    // this.server.clients.forEach(client => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(JSON.stringify({ event: 'connect', data: null }));
    //   }
    // });
    // client.send(JSON.stringify({ event: 'connect', data: null }));
  }
}