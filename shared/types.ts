/**
 * cell types
 */
export type Cell = {
  row: number;
  col: number;
  value: SudokuDigit | null;
  given: boolean;
  actual: SudokuDigit;
  candidates: SudokuDigit[] | null;
};

export type SelectedCell = { row: number; col: number };

export type CellPayload = {
  row: number;
  col: number;
  value: SudokuDigit;
};

export type CellPosition = {
  row: number;
  col: number;
};

/**
 * game types
 */
export type SudokuGame = { board: Cell[][]; startedAt: number };

export type GameAction = 'newGame' | 'restart';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type SudokuDigit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type CellFill = 'digit' | 'candidate';

export type RemainingCounts = Record<SudokuDigit, number>;

/**
 * player types
 */
export type PlayerInfo = { id: string; name: string };

/**
 * websocket types
 */
export type ClientMessage =
  | { type: 'join'; roomId: string; name: string }
  | {
      type: 'cell_update';
      row: number;
      col: number;
      value: SudokuDigit | null;
    };

export type ServerMessage =
  | { type: 'players'; players: PlayerInfo[] }
  | {
      type: 'cell_updated';
      row: number;
      col: number;
      value: SudokuDigit | null;
    }
  | { type: 'game_state'; game: SudokuGame; startedAt: number }
  | { type: 'player_joined'; player: PlayerInfo }
  | { type: 'player_left'; playerId: string };
