import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
  checkWinner(board: Array<string>): string | undefined {
    const winningScenarios = [
      [0, 1, 2], // Top row
      [3, 4, 5], // Middle row
      [6, 7, 8], // Bottom row
      [0, 3, 6], // Left column
      [1, 4, 7], // Middle column
      [2, 5, 8], // Right column
      [0, 4, 8], // Diagonal \
      [2, 4, 6], // Diagonal /
    ];

    for (const scenario of winningScenarios) {
      const [a, b, c] = scenario;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
  }

  checkDraw(board: Array<string>): boolean {
    return board.every((cell) => cell !== null) && !this.checkWinner(board);
  }
}
