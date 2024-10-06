import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

export interface Message {
  event: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket$: WebSocketSubject<Message>;
  public chat$!: Observable<Message>;
  public clientId$!: Observable<Message>;

  constructor() {
    this.socket$ = webSocket<Message>({
      url: 'ws://localhost:8080',
      deserializer: (e) => JSON.parse(e.data) as Message,
    });
    this.chat$ = this.socket$.multiplex(
      () => ({ subscribe: 'chat' }), 
      () => ({ unsubscribe: 'chat' }), 
      (message) => message.event === 'chat'
    );
    this.clientId$ = this.socket$.multiplex(
      () => ({ subscribe: 'connect' }), 
      () => ({ unsubscribe: 'connect' }), 
      (message) => message.event === 'connect'
    );
    this.socket$.next({ event: 'connect', data: 'chat' });
  }

  sendChatMessage(msg: Message) {
    this.socket$.next(msg);
  }

  getSocket$() {
    return this.clientId$;
  }

  getMessages$() {
    return this.chat$;
  }
}