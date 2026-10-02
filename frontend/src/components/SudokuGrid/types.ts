import { Difficulty, SudokuDigit } from '@sudokuparty/shared/types';
/**
 * cell types
 */
export type SelectedCell = { row: number; col: number };

export type CellPayload = {
  row: number;
  col: number;
  value: SudokuDigit;
};

/**
 * game types
 */
export type CellFill = 'digit' | 'candidate';
export type GameAction = 'newGame' | 'restart';
export type PlayerMode = 'single' | 'multi';

export type SetupConfig =
  | {
      name?: string;
      difficulty: Difficulty;
      mode: PlayerMode;
    }
  | {
      name?: string;
      roomId: string;
      difficulty: Difficulty;
      mode: PlayerMode;
    };

export type SetupForm = {
  difficulty?: Difficulty;
  mode?: PlayerMode;
  name?: string;
};

export type MultiplayerConfig = {
  name?: string;
  roomId: string;
  difficulty: Difficulty;
  mode: PlayerMode;
};
