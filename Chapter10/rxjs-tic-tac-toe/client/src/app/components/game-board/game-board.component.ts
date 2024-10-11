import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { GameService, WsMessage } from '../../services/game.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements OnInit, OnDestroy {
  currentPlayerTurn = 'X';
  playerJoined = '';
  board = Array(9).fill(null);
  winner$!: Observable<'X' | 'O'>;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.getPlayers$().subscribe(({ data }: WsMessage) => {
      this.playerJoined = data;
    });
    this.gameService.getBoardUpdate$().subscribe(({ data }: WsMessage) => {
      const { move, currentPlayer, nextPlayer } = data;
      this.board[move] = currentPlayer;
      this.currentPlayerTurn = nextPlayer;
    });
    this.winner$ = this.gameService.getWinner$();
  }

  ngOnDestroy(): void {
    this.gameService.close();
  }

  handleMove(field: number) {
    this.gameService.move(field, this.playerJoined, this.currentPlayerTurn);
  }

  isPlayerX(field: number): boolean {
    return this.board[field] === 'X';
  }
}
