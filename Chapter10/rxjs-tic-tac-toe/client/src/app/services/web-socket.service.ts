import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

export interface WsMessage {
  event: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket$!: WebSocketSubject<WsMessage>;
  public playerJoined$!: Observable<WsMessage>;
  public boardUpdate$!: Observable<WsMessage>;
  public winner$!: Observable<WsMessage>;

  constructor() {
    this.socket$ = webSocket<WsMessage>({
      url: 'ws://localhost:8080',
      deserializer: (e) => JSON.parse(e.data) as WsMessage,
    });
    this.playerJoined$ = this.socket$.multiplex(
      () => ({ subscribe: 'join' }), 
      () => ({ unsubscribe: 'join' }), 
      (message) => message.event === 'join'
    );
    this.boardUpdate$ = this.socket$.multiplex(
      () => ({ subscribe: 'boardUpdate' }), 
      () => ({ unsubscribe: 'boardUpdate' }), 
      (message) => message.event === 'boardUpdate'
    );
    this.winner$ = this.socket$.multiplex(
      () => ({ subscribe: 'winner' }), 
      () => ({ unsubscribe: 'winner' }), 
      (message) => message.event === 'winner'
    );
  }

  getPlayers$() {
    return this.playerJoined$;
  }

  getWinner$() {
    return this.winner$;
  }

  getBoardUpdate$() {
    return this.boardUpdate$;
  }

  public send(message: any): void {
    this.socket$.next(message);
  }

  public close(): void {
    this.socket$.complete();
  }

  public get messages$() {
    return this.socket$.asObservable();
  }

  move(field: number, player: string, currentPlayerTurn: string): void {
    if (player !== currentPlayerTurn) {
      return;
    }

    this.send({ event: 'move', data: field }); 
  }
  
}
