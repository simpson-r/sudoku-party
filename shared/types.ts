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

export type CellUpdate = {
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
export type SudokuDigit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type GameAction = 'newGame' | 'restart';
export type CellFill = 'digit' | 'candidate';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type RemainingCounts = Record<SudokuDigit, number>;
export type CandidateUpdate = {
  row: number;
  col: number;
  candidates: SudokuDigit[];
};
export type GameErrorCode = 'ROOM_FULL' | 'ROOM_NOT_FOUND';

/**
 * player types
 */
export type PlayerInfo = { id: string; name: string; score: number };

/**
 * websocket types
 */
export type ClientMessage =
  | { type: 'join'; roomId: string }
  | { type: 'new_game' }
  | {
      type: 'cell_update';
      row: number;
      col: number;
      value: SudokuDigit | null;
    }
  | {
      type: 'candidate_add';
      row: number;
      col: number;
      candidate: SudokuDigit;
    }
  | {
      type: 'candidate_remove';
      row: number;
      col: number;
      candidates: SudokuDigit[];
    };

export type ServerMessage =
  | { type: 'identity'; playerId: string }
  | { type: 'players'; players: PlayerInfo[] }
  | { type: 'player_joined'; player: PlayerInfo }
  | { type: 'player_left'; playerName: string }
  | { type: 'error'; code: GameErrorCode }
  | { type: 'game_state'; game: SudokuGame; players: PlayerInfo[] }
  | { type: 'game_complete'; completedAt: number }
  | {
      type: 'cell_updated';
      row: number;
      col: number;
      value: SudokuDigit | null;
      player: PlayerInfo;
    }
  | {
      type: 'candidates_updated';
      row: number;
      col: number;
      candidates: SudokuDigit[];
    };
