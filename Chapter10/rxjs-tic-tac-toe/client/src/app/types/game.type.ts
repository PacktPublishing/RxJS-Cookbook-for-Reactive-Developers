export enum EPlayer {
  X = 'X',
  O = 'O'
}

export interface IPlayerJoined {
    board: string[];
    player: EPlayer;
    nextPlayer: EPlayer;
}

export interface IBoardUpdate {
    move: number;
    currentPlayer: EPlayer;
    nextPlayer: EPlayer;
}