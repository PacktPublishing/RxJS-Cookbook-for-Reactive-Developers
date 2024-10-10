import { ConnectedSocket, MessageBody, OnGatewayConnection, WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, shareReplay, tap, withLatestFrom } from 'rxjs/operators';
import * as WebSocket from 'ws';
import { GameService } from './game.service';

@WebSocketGateway(8080)
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: WebSocket.Server;

  private currentPlayer = 'X';
  private clients$ = new BehaviorSubject<WebSocket[]>([]);
  private moves$ = new Subject<number>();
  private board = Array(9).fill(null);

  constructor(private gameService: GameService) {
    this.clients$.pipe(
      tap(clients => {
        if (clients.length === 1) {
          const player = 'X';
          clients[0].send(JSON.stringify({ event: 'join', data: player }));

          return;
        }

        if (clients.length === 2) {
          const player = 'O';
          clients[1].send(JSON.stringify({ event: 'join', data: player }));
        }
      })
    ).subscribe();

    const playerMoves$ = this.moves$.pipe(
      withLatestFrom(this.clients$),
      map(([move, clients]) => {
        const nextPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.board[move] = this.currentPlayer;

        clients.forEach(client => {
          client.send(JSON.stringify({ event: 'boardUpdate', data: { move, currentPlayer: this.currentPlayer, nextPlayer } }));
        });

        this.currentPlayer = nextPlayer;

        return clients;
      }))

      playerMoves$.pipe(
        tap((clients) => {
          const winner = this.gameService.checkWinner(this.board);
          if (winner) {
            this.moves$.complete();

            clients.forEach(client => {
              client.send(JSON.stringify({ event: 'winner', data: winner }));
            });
          }
        }),
        shareReplay({ bufferSize: 1, refCount: true }),
      ).subscribe();
  }

  handleConnection(@ConnectedSocket() client: WebSocket): void {    
    if (this.clients$.getValue().length >= 2) {
      client.send(JSON.stringify({ event: 'join', data: 'Game started' }));
      client.close();
      return;
    }
    
    this.clients$.next([...this.clients$.getValue(), client]);
  }

  @SubscribeMessage('move')
  handleMove(@MessageBody() data: number): void {
    this.moves$.next(data);
  }
}