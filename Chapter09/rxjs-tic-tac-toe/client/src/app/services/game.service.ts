import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { EPlayer, IBoardUpdate, IPlayerJoined } from '../types/game.type';

export interface WsMessage<T> {
  event: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private socket$!: WebSocketSubject<WsMessage<any>>;
  private playerJoined$!: Observable<WsMessage<IPlayerJoined>>;
  public boardUpdate$!: Observable<WsMessage<IBoardUpdate>>;
  public winner$!: Observable<WsMessage<EPlayer>>;
  public draw$!: Observable<WsMessage<boolean>>;

  constructor() {
    this.socket$ = webSocket<WsMessage<any>>({
      url: 'ws://localhost:8080',
      deserializer: (e) => JSON.parse(e.data) as WsMessage<any>,
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
    this.draw$ = this.socket$.multiplex(
      () => ({ subscribe: 'draw' }), 
      () => ({ unsubscribe: 'draw' }), 
      (message) => message.event === 'draw'
    );
  }

  getPlayers$(): Observable<WsMessage<IPlayerJoined>> {
    return this.playerJoined$;
  }

  getWinner$(): Observable<EPlayer> {
    return this.winner$.pipe(map(({ data }: WsMessage<EPlayer>) => data));
  }

  getDraw$(): Observable<boolean> {
    return this.draw$.pipe(map(({ data }: WsMessage<boolean>) => data));
  }

  getBoardUpdate$() {
    return this.boardUpdate$;
  }

  public send(message: WsMessage<any>): void {
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
