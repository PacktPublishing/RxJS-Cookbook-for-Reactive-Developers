import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public winner = new BehaviorSubject<string>('');
  public currentPlayerTurn = new BehaviorSubject<string>('X');
  public playerJoined = new BehaviorSubject<string>('');

  constructor(private webSocketService: WebSocketService) { }

  join(): void {
    this.webSocketService.send({ type: 'join' });
  }

  move(field: number): void {
    if (this.currentPlayerTurn.value !== this.playerJoined.value || this.winner.value) {
      return;
    }
    console.log('turn', this.currentPlayerTurn.value);

    this.webSocketService.send({ type: 'move', message: {
      field,
      player: this.currentPlayerTurn.value
    }}); 
  }



}
