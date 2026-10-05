import { BOX_SIZE, GRID_SIZE } from '@sudokuparty/shared/constants';
import { Cell, SudokuDigit } from '@sudokuparty/shared/types';

/**
 * Formats a duration in seconds as MM:SS or HH:MM:SS.
 */
export const formatSeconds = (secs: number) => {
  const pad = (num: number) => (num < 10 ? `0${num}` : num);

  const h = Math.floor(secs / 3600);
  const m = Math.floor(secs / 60) - h * 60;
  const s = Math.floor(secs - h * 3600 - m * 60);

  return `${h > 0 ? `${pad(h)}:` : ''}${pad(m)}:${pad(s)}`;
};

/**
 * Returns the elapsed time in seconds since the game started
 */
export const getGameElapsedTime = (
  startedAt: number,
  totalPausedMs: number,
  completedAt = Date.now(),
) => Math.floor((completedAt - startedAt - totalPausedMs) / 1000);

/**
 * Generates valid candidates for each empty cell based on the current board state
 */
export const generateAutoCandidates = (board: Cell[][], cell: Cell) => {
  if (cell.value !== null) return [];
  const candidates = [];

  for (let i = 1; i < GRID_SIZE + 1; i++) {
    const digit = i as SudokuDigit;
    if (canPlaceValue(board, digit, cell.row, cell.col)) candidates.push(digit);
  }

  return candidates;
};

// helpers
const existsInSquare = (
  grid: Cell[][],
  num: SudokuDigit,
  row: number,
  col: number,
): boolean => {
  const startRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const startCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let r = startRow; r < startRow + BOX_SIZE; r++) {
    for (let c = startCol; c < startCol + BOX_SIZE; c++) {
      if (grid[r][c].value === num) return true;
    }
  }

  return false;
};

const existsInRow = (grid: Cell[][], num: SudokuDigit, row: number) =>
  grid[row].some((cell) => cell.value === num);

const existsInCol = (grid: Cell[][], num: SudokuDigit, col: number) =>
  grid.some((row) => row[col].value === num);

const canPlaceValue = (
  grid: Cell[][],
  val: SudokuDigit,
  r: number,
  c: number,
): boolean =>
  !existsInRow(grid, val, r) &&
  !existsInCol(grid, val, c) &&
  !existsInSquare(grid, val, r, c);
