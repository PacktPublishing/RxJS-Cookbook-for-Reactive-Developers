import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { map, scan, shareReplay, tap, withLatestFrom } from 'rxjs/operators';
import * as WebSocket from 'ws';

export interface Message {
  event: string;
  data?: any;
}

@WebSocketGateway(8080)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: WebSocket.Server;

  private topics: { [topic: string]: ReplaySubject<{ message: string, clientId: string }> } = {};
  
  @SubscribeMessage('connect')
  handleSubscribe(
    @MessageBody() topic: string,
    @ConnectedSocket() client: WebSocket,
  ): void {
    if (!this.topics[topic]) {
      this.topics[topic] = new ReplaySubject();
    }
    const subscription = this.topics[topic].pipe(
      map(({ message, clientId }) => ({ 
        id: crypto.randomUUID(), 
        message: message, 
        timestamp: new Date(),
        sender: clientId
      })),
      tap(data => console.log(data)),
      scan((acc, message) => [...acc, message], []),
      map(data => ({ event: 'chat', data })),
      shareReplay(1)
    ).subscribe((response) => client.send(JSON.stringify(response)));

    client.on('close', () => subscription.unsubscribe());
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() payload: { topic: string, message: string, clientId: string }
  ): void {
    const { topic, message, clientId } = payload;

    if (this.topics[topic]) {
      this.topics[topic].next({
        message,
        clientId,
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