import { GRID_SIZE } from "@shared/constants";
import { SudokuDigit } from "@shared/types";


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