import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

export interface Message {
  id: string;
  message: string;
  clientId: string;
  timestamp: Date;
}

export interface WsMessage {
  event: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket$: WebSocketSubject<WsMessage>;
  public chat$!: Observable<WsMessage>;
  public clientConnection$!: Observable<WsMessage>;
  public isTyping$!: Observable<WsMessage>;

  constructor() {
    this.socket$ = webSocket<WsMessage>({
      url: 'ws://localhost:8080',
      deserializer: (e) => JSON.parse(e.data) as WsMessage,
    });
    this.chat$ = this.socket$.multiplex(
      () => ({ subscribe: 'chat' }), 
      () => ({ unsubscribe: 'chat' }), 
      (message) => message.event === 'chat'
    );
    this.clientConnection$ = this.socket$.multiplex(
      () => ({ subscribe: 'connection' }), 
      () => ({ unsubscribe: 'connection' }), 
      (message) => message.event === 'connect'
    );
    this.isTyping$ = this.socket$.multiplex(
      () => ({ subscribe: 'typing' }), 
      () => ({ unsubscribe: 'typing' }), 
      (message) => message.event === 'typing'
    );
    this.socket$.next({ event: 'connect', data: 'chat' });
  }

  sendChatMessage(message: string, clientId: string) {
    this.socket$.next({ event: 'message', data: { topic: 'chat', message, clientId }});
  }

  sendIsTyping(clientId: string, isTyping: boolean = true) {
    this.socket$.next({ event: 'typing', data: { topic: 'chat', clientId, isTyping } });
  }

  getClientConnection$(): Observable<WsMessage> {
    return this.clientConnection$;
  }

  getChatSocket$(): Observable<WsMessage> {
    return this.chat$;
  }

  getIsTyping$() {
    return this.isTyping$;
  }
}