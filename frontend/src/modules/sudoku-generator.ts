import {
  BOX_SIZE,
  GRID_SIZE,
  REMOVALS,
} from '@/components/SudokuGrid/constants';
import {
  Difficulty,
  Cell,
  SudokuGame,
  SudokuDigit,
} from '@/components/SudokuGrid/types';
import { shuffle } from '@/utils/helpers';

// constants
const VALUES = Array.from({ length: GRID_SIZE }, (_, index) => index + 1);
const POSITIONS = Array.from(
  { length: GRID_SIZE * GRID_SIZE },
  (_, index) => index,
);

/**
 * Sudoku generation module
 */
const countSolutions = (grid: number[][], limit = 2): number => {
  let count = 0;

  const search = (): void => {
    if (count >= limit) return;

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] !== 0) continue;

        for (const value of VALUES) {
          if (!canPlaceValue(grid, value, row, col)) continue;

          grid[row][col] = value;
          search();
          grid[row][col] = 0;

          if (count >= limit) return;
        }
        return; // we've explored every possible value for this empty cell.
      }
    }
    count++;
  };

  search();

  return count;
};

const fillSudokuGrid = (grid: number[][]): boolean => {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] !== 0) continue;

      for (const val of shuffle(VALUES)) {
        if (!canPlaceValue(grid, val, r, c)) continue;

        grid[r][c] = val;
        if (fillSudokuGrid(grid)) return true;

        grid[r][c] = 0; // undo the choice when this branch cannot produce a solution
      }
      return false; // no candidate worked for this cell
    }
  }
  return true;
};

const createSudokuGrid = (solution: number[][], removals: number): Cell[][] => {
  const puzzle = solution.map((row) => [...row]);
  let numRemovals = 0;

  for (const position of shuffle(POSITIONS)) {
    if (numRemovals >= removals) break;

    const row = Math.floor(position / GRID_SIZE);
    const col = position % GRID_SIZE;

    const previous = puzzle[row][col];
    puzzle[row][col] = 0;

    if (countSolutions(puzzle) !== 1) {
      puzzle[row][col] = previous;
      continue;
    }

    numRemovals++;
  }

  return puzzle.map((puzzleRow, row) =>
    puzzleRow.map((value, col) => {
      const given = value !== 0;
      return {
        row,
        col,
        actual: solution[row][col] as SudokuDigit,
        given,
        value: given ? (value as SudokuDigit) : null,
        candidates: [],
      };
    }),
  );
};

export const generateSudokuGame = (
  difficulty: Difficulty = 'easy',
): SudokuGame => {
  const solution = Array.from({ length: GRID_SIZE }, () =>
    Array<number>(GRID_SIZE).fill(0),
  );

  const generated = fillSudokuGrid(solution); // create solved sudoku grid

  if (!generated) {
    throw new Error('Failed to generate a complete Sudoku grid.');
  }

  const puzzle = createSudokuGrid(solution, REMOVALS[difficulty]); // remove values based on selected difficulty

  return { solution, puzzle };
};

/**
 * helpers
 */
const existsInRow = (grid: number[][], num: number, row: number) =>
  grid[row].includes(num);

const existsInCol = (grid: number[][], num: number, col: number) =>
  grid.some((row) => row[col] === num);

const existsInSquare = (
  grid: number[][],
  value: number,
  row: number,
  col: number,
): boolean => {
  const startRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const startCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let r = startRow; r < startRow + BOX_SIZE; r++) {
    for (let c = startCol; c < startCol + BOX_SIZE; c++) {
      if (grid[r][c] === value) return true;
    }
  }

  return false;
};

const canPlaceValue = (
  grid: number[][],
  val: number,
  r: number,
  c: number,
): boolean =>
  !existsInRow(grid, val, r) &&
  !existsInCol(grid, val, c) &&
  !existsInSquare(grid, val, r, c);
