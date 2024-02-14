export interface GameSettings {
    boardSize: number;
    winCondition: number;
    player1: { mark: string, color: string };
    player2: { mark: string, color: string };
    firstPlayer: 'player1' | 'player2' | 'random';
}