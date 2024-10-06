import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

export interface Message {
  event: string;
  payload?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket$: WebSocketSubject<any>;
  public chat$!: Observable<Message>;

  constructor() {
    this.socket$ = webSocket<Message>({
      url: 'ws://localhost:8080',
      deserializer: (e) => JSON.parse(e.data) as Message,
    });
    this.chat$ = this.socket$.multiplex(
      () => ({ subscribe: 'chat' }), 
      () => ({ unsubscribe: 'chat' }), 
      (message) => message.type === 'chat'
    );
    this.socket$.next({ event: 'connect', data: 'chat' });
  }

  sendChatMessage(msg: Message) {
    this.socket$.next(msg);
  }

  getMessages() {
    return this.socket$.asObservable();
  }
}