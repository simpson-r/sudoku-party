import type { SudokuDigit } from './types';

// grid
export const GRID_SIZE = 9;
export const BOX_SIZE = Math.sqrt(GRID_SIZE);
export const REMOVALS = { easy: 42, medium: 46, hard: 52 };

// game
export const DIFFICULTY_MAP = { e: 'easy', m: 'medium', h: 'hard',} as const;
export const INITIAL_REMAINING: Record<SudokuDigit, number> = {
  1: GRID_SIZE,
  2: GRID_SIZE,
  3: GRID_SIZE,
  4: GRID_SIZE,
  5: GRID_SIZE,
  6: GRID_SIZE,
  7: GRID_SIZE,
  8: GRID_SIZE,
  9: GRID_SIZE,
};