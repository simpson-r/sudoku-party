/**
 * cell types
 */
export type Cell = {
  row: number;
  col: number;
  value: number | null;
  given: boolean;
  actual: number;
};

export type SelectedCell = { row: number; col: number };

/**
 * game types
 */
export type SudokuGame = {
  puzzle: Cell[][];
  solution: number[][];
};


export type Mode = 'easy' | 'medium' | 'hard';
