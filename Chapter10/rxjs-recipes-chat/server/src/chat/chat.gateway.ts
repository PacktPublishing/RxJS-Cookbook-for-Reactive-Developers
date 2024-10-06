// import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
// import { Observable, from, groupBy, map, mergeAll, mergeMap, tap, toArray } from 'rxjs';
// import * as WebSocket from 'ws';

// const messages$ = from([
//   { topic: 'topic1', content: 'Hello, world!' },
//   { topic: 'topic2', content: 'How are you?' },
//   { topic: 'topic1', content: 'I\'m fine, thank you.' },
//   // More messages...
// ]);

// const groupedMessages$ = messages$.pipe(
//   groupBy(message => message.topic),
//   mergeMap(group$ =>
//     group$.pipe(toArray())
//   ),
//   tap(console.log)
//   // mergeAll()
// );

// @WebSocketGateway(8080)
// export class ChatGateway {
//   @WebSocketServer()
//   server: WebSocket.Server;

//   @SubscribeMessage('message')
//   handleMessage(client: WebSocket, payload: any): Observable<WsResponse<string>> {
//     return groupedMessages$;
//   }
// }

import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { time } from 'console';
import { from, Observable, ReplaySubject, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as WebSocket from 'ws';

@WebSocketGateway(8080)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: WebSocket.Server;

  private topics: { [topic: string]: Subject<any> } = {};

  @SubscribeMessage('connect')
  handleSubscribe(client: WebSocket, topic: string): void {
    if (!this.topics[topic]) {
      this.topics[topic] = new ReplaySubject();
    }

    const subscription = this.topics[topic].pipe(
      map(data => ({ message: data, timestamp: new Date() })),
      map(data => ({ event: 'message', payload: data }))
    ).subscribe(
      (response) => client.send(JSON.stringify(response))
    );

    client.on('close', () => subscription.unsubscribe());
  }

  @SubscribeMessage('message')
  handleMessage(client: WebSocket, payload: { topic: string, message: string }): void {
    const { topic, message } = payload;

    if (this.topics[topic]) {
      this.topics[topic].next(message);
    }
  }

  handleConnection(client: WebSocket, ...args: any[]): void {
    console.log('Client connected');
  }

  handleDisconnect(client: WebSocket): void {
    console.log('Client disconnected');
  }
}