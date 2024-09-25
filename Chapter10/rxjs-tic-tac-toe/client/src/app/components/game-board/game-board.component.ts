import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements OnInit {
  currentPlayerTurn = '';
  playerJoined = '';
  board: any = [];
  winner = '';

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.join();
    this.gameService.currentPlayerTurn.subscribe((player) => {
      console.log('currentPlayerTurn', player);
      this.currentPlayerTurn = player;
    });
    this.gameService.playerJoined.subscribe((player) => {
      this.playerJoined = player;
    });
    this.gameService.board.subscribe((board) => {
      this.board = board
    });
    this.gameService.winner.subscribe((winner) => {
      this.winner = winner
    });
  }

  handleMove(field: number) {
    this.gameService.move(field);
  }
}
