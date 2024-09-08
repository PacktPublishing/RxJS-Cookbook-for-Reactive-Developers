import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private board = Array(9).fill(null);
  public winner = new BehaviorSubject<string>('');
  public currentPlayer = new BehaviorSubject<string>('X');

  constructor(private webSocketService: WebSocketService) { 
    // console.log('GameService constructor', this.webSocketService.messages$);
    this.webSocketService.messages$.subscribe({
      next: ({ type, message }: any) => {
        if (type === 'playerJoined') {
          this.currentPlayer.next(message);
        }
        console.log(message)
        // if (message.type === 'move') {
        //   this.board[message.message.field] = message.message.player;
        //   this.checkWinner();
        //   this.currentPlayer.next(this.currentPlayer.value === 'X' ? 'O' : 'X');
        // }
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  move(field: number): void {
    this.webSocketService.send({ type: 'move', message: field }); 
  }

}
