import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { WebSocketService, WsMessage } from '../../services/web-socket.service';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements OnInit {
  currentPlayerTurn = 'X';
  playerJoined = '';
  board = Array(9).fill(null);
  winner = '';

  constructor(private wsService: WebSocketService) { }

  ngOnInit() {
    this.wsService.getPlayers$().subscribe(({ data }: WsMessage) => {
      this.playerJoined = data;
    });
    this.wsService.getWinner$().subscribe(({ data }: WsMessage) => {
      this.winner = data;
    });
    this.wsService.getBoardUpdate$().subscribe(({ data }: WsMessage) => {
      const { move, currentPlayer, nextPlayer } = data;
      this.board[move] = currentPlayer;
      this.currentPlayerTurn = nextPlayer;
    });
  }

  handleMove(field: number) {
    this.wsService.move(field, this.playerJoined, this.currentPlayerTurn);
  }
}
