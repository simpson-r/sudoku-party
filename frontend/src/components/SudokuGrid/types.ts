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
export type SudokuGame = {
  puzzle: Cell[][];
  solution: number[][];
};

export type GameAction = 'newGame' | 'restart';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type SudokuDigit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type CellFill = 'digit' | 'candidate';
