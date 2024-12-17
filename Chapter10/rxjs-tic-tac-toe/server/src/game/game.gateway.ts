import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, shareReplay, tap, withLatestFrom } from 'rxjs/operators';
import * as WebSocket from 'ws';
import { OnModuleInit } from '@nestjs/common';
import { GameService } from './game.service';

@WebSocketGateway(8080)
export class GameGateway implements OnGatewayConnection, OnModuleInit {
  @WebSocketServer()
  server: WebSocket.Server;

  private currentPlayer = 'X';
  private clients$ = new BehaviorSubject<WebSocket[]>([]);
  private moves$ = new Subject<number>();
  private board = Array(9).fill(null);

  constructor(private gameService: GameService) {}

  onModuleInit(): void {
    this.clients$
      .pipe(
        tap((clients) => {
          clients.forEach((client) => {
            client.send(
              JSON.stringify({
                event: 'join',
                data: {
                  player: client.player,
                  board: this.board,
                  nextPlayer: this.currentPlayer,
                },
              }),
            );
          });
        }),
      )
      .subscribe();

    this.initializePlayerMoves();
  }

  @SubscribeMessage('move')
  handleMove(@MessageBody() data: number): void {
    this.moves$.next(data);
  }

  @SubscribeMessage('draw')
  handleDraw(): void {
    this.resetGame();
  }

  handleConnection(@ConnectedSocket() client: WebSocket): void {
    if (this.clients$.getValue().length >= 2) {
      client.send(
        JSON.stringify({ event: 'join', data: 'Game has already started.' }),
      );
      client.close();
      return;
    }

    const clients = this.clients$.getValue();
    const clientId = crypto.randomUUID();
    client.id = clientId;
    client.player = !clients.map((c) => c.player).includes('X') ? 'X' : 'O';
    this.clients$.next([...clients, client]);
  }

  handleDisconnect(@ConnectedSocket() client: WebSocket): void {
    const clients = this.clients$.getValue();
    this.clients$.next(clients.filter((c) => c.id !== client.id));
  }

  private initializePlayerMoves() {
    // Step 2: Playing a move
    // this.moves$.pipe(
    //   withLatestFrom(this.clients$),
    //   map(([move, clients]) => {
    //     const nextPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    //     this.board[move] = this.currentPlayer;

    //     clients.forEach((client) => {
    //       client.send(
    //         JSON.stringify({
    //           event: 'boardUpdate',
    //           data: { move, currentPlayer: this.currentPlayer, nextPlayer },
    //         }),
    //       );
    //     });

    //     this.currentPlayer = nextPlayer;

    //     return clients;
    //   }),
    //   shareReplay({ bufferSize: 1, refCount: true }),
    // );
    const playerMoves$ = this.moves$.pipe(
      withLatestFrom(this.clients$),
      filter(([move]) => this.board[move] === null),
      map(([move, clients]) => {
        const nextPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.board[move] = this.currentPlayer;

        clients.forEach((client) => {
          client.send(
            JSON.stringify({
              event: 'boardUpdate',
              data: { move, currentPlayer: this.currentPlayer, nextPlayer },
            }),
          );
        });

        this.currentPlayer = nextPlayer;

        return clients;
      }),
    );

    playerMoves$
      .pipe(
        tap((clients: WebSocket[]) => this.handleCheckWinner(clients)),
        tap((clients: WebSocket[]) => this.handleCheckDraw(clients)),
        shareReplay({ bufferSize: 1, refCount: true }),
      )
      .subscribe();
  }

  private handleCheckWinner(clients: WebSocket[]): void {
    const winner = this.gameService.checkWinner(this.board);
    if (winner) {
      this.moves$.complete();

      clients.forEach((client) => {
        client.send(JSON.stringify({ event: 'winner', data: winner }));
      });

      this.resetGame();
    }
  }

  private handleCheckDraw(clients: WebSocket[]): void {
    const draw = this.gameService.checkDraw(this.board);

    if (draw) {
      this.moves$.complete();

      clients.forEach((client) => {
        client.send(JSON.stringify({ event: 'draw', data: 'Game is a draw' }));
      });

      this.resetGame();
    }
  }

  private resetGame(): void {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.moves$ = new Subject<number>();
    this.initializePlayerMoves();
  }
}
