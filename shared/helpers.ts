
import { DIFFICULTY_MAP, INITIAL_REMAINING } from './constants';
import type { Cell } from './types';


/**
 * Parses the difficulty encoded in the room ID prefix.
 */
export const parseDifficulty = (roomId: string) =>
  DIFFICULTY_MAP[roomId[0] as keyof typeof DIFFICULTY_MAP];

/**
 * Returns a randomly shuffled copy of an array without mutating the original (Fisher–Yates)
 */
export const shuffle = <T>(values: T[]): T[] => {
  const result = [...values];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

/**
 * Updates a cell and returns the new board and updated cell without mutating the original board
 */
export const updateBoard = (
  board: Cell[][],
  row: number,
  col: number,
  patch: Partial<Cell>,
) => {
  const cell: Cell = {
    ...board[row][col],
    ...patch,
  };

  const updatedRow = board[row].with(col, cell);
  const updatedBoard = board.with(row, updatedRow);

  return { board: updatedBoard, cell };
};

/**
 * Calculates how many placements remain for each digit
 */
export const buildRemainingCounts = (puzzle: Cell[][]) => {
  const remaining = { ...INITIAL_REMAINING };
  for (const row of puzzle) {
    for (const { actual, given } of row) {
      if (given) remaining[actual]--;
    }
  }

  return remaining;
};
