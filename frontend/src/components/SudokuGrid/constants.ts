import { SudokuDigit } from "./types";

// grid
export const GRID_SIZE = 9;
export const BOX_SIZE = Math.sqrt(GRID_SIZE);
export const REMOVALS = { easy: 44, medium: 48, hard: 52 };

// time
export const ONE_SEC = 1000;

// game state
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