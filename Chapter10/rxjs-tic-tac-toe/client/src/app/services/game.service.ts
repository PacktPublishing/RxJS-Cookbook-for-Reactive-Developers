import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public board = new BehaviorSubject(Array(9).fill(null));
  public winner = new BehaviorSubject<string>('');
  public currentPlayerTurn = new BehaviorSubject<string>('X');
  public playerJoined = new BehaviorSubject<string>('');

  constructor(private webSocketService: WebSocketService) { 
    this.webSocketService.messages$.subscribe({
      next: ({ type, message }: any) => {
        if (type === 'playerJoined') {
          this.playerJoined.next(message);
        }
        if (type === 'boardUpdate') {
          const { field, player, currentPlayer } =  message;
          this.board.value[field] = player;
          this.board.next(this.board.value);
          this.checkWinner();
          this.currentPlayerTurn.next(currentPlayer);
        }
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  join(): void {
    this.webSocketService.send({ type: 'join' });
  }

  move(field: number): void {
    console.log('move', this.playerJoined.value);

    if (this.currentPlayerTurn.value !== this.playerJoined.value || this.winner.value) {
      return;
    }
    console.log('turn', this.currentPlayerTurn.value);

    this.webSocketService.send({ type: 'move', message: {
      field,
      player: this.currentPlayerTurn.value
    }}); 
  }

  checkWinner(): void {
    const winningScenarios = [
      [0, 1, 2], // Top row
      [3, 4, 5], // Middle row
      [6, 7, 8], // Bottom row
      [0, 3, 6], // Left column
      [1, 4, 7], // Middle column
      [2, 5, 8], // Right column
      [0, 4, 8], // Diagonal \
      [2, 4, 6]  // Diagonal /
    ];

    for (const scenario of winningScenarios) {
      const [a, b, c] = scenario;
      if (this.board.value[a] && this.board.value[a] === this.board.value[b] && this.board.value[a] === this.board.value[c]) {
        this.winner.next(this.board.value[a]);
      }
    }
  }

}
