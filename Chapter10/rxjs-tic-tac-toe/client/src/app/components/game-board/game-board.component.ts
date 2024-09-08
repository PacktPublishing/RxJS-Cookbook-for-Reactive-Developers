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
  currentPlayer = '';

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.move(1);
    this.gameService.currentPlayer.subscribe((player) => {
      this.currentPlayer = player;
    });
  }

  handleMove(field: number) {
    this.gameService.move(field);
  }
}
