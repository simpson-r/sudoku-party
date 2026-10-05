import {
  BOX_SIZE,
  DIFFICULTY_MAP,
  GRID_SIZE,
  INITIAL_REMAINING,
} from './constants';
import type { Cell, CellPosition, SudokuDigit } from './types';

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
    for (const { actual, value, given } of row) {
      if (given || value === actual) remaining[actual]--;
    }
  }

  return remaining;
};

/**
 * Removes a candidate from all cells in the same row, column, and box
 */
export const cleanupCandidates = (
  pos: CellPosition,
  candidate: SudokuDigit,
  prevBoard: Cell[][],
) => {
  // clone board
  const board = prevBoard.map((row) =>
    row.map((cell) => ({
      ...cell,
      candidates: cell.candidates ? [...cell.candidates] : [],
    })),
  );
  const { row, col } = pos;

  const removeCandidate = (cell: Cell) => {
    if (cell.candidates?.includes(candidate)) {
      cell.candidates = cell.candidates.filter((value) => value !== candidate);
    }
  };
  // row
  board[row].forEach(removeCandidate);
  // col
  for (let i = 0; i < GRID_SIZE; i++) removeCandidate(board[i][col]);
  // box
  const startRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const startCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let r = startRow; r < startRow + BOX_SIZE; r++) {
    for (let c = startCol; c < startCol + BOX_SIZE; c++) {
      removeCandidate(board[r][c]);
    }
  }

  return board;
};

/**
 * Checks whether the puzzle is complete by verifying all cells contain a value.
 */
export const isPuzzleComplete = (board: Cell[][]) =>
  board.every((row) => row.every((cell) => cell.value === cell.actual));
