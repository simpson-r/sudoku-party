import { BOX_SIZE, GRID_SIZE, REMOVALS } from '../components/SudokuGrid/constants';
import { Difficulty, Cell, SudokuGame } from '../components/SudokuGrid/types';

const VALUES = Array.from({ length: GRID_SIZE }, (_, index) => index + 1);

/** helpers */
const shuffle = <T>(values: T[]): T[] => {
  const result = [...values];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

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

/**
 * sudoku generation module
 */
const fillSudokuGrid = (grid: number[][]): boolean => {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] !== 0) continue;

      for (const val of shuffle(VALUES)) {
        if (!canPlaceValue(grid, val, r, c)) continue;

        grid[r][c] = val;
        if (fillSudokuGrid(grid)) return true;

        grid[r][c] = 0; // undo the choice when this branch cannot produce a solution.
      }
      return false; // no candidate worked for this empty cell.
    }
  }
  return true; // there are no empty cells remaining.
};

const createPuzzleGrid = (solution: number[][], removals: number): Cell[][] => {
  const removed = new Set(
    shuffle(
      Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => index),
    ).slice(0, removals),
  );

  return solution.map((row, rowIndex) =>
    row.map((actual, colIndex) => {
      const given = !removed.has(rowIndex * GRID_SIZE + colIndex);

      return {
        row: rowIndex,
        col: colIndex,
        actual,
        given,
        value: given ? actual : null,
      };
    }),
  );
};

export const generateSudokuGame = (mode: Difficulty = 'easy'): SudokuGame => {
  const solution = Array.from({ length: GRID_SIZE }, () =>
    Array<number>(GRID_SIZE).fill(0),
  );

  const generated = fillSudokuGrid(solution);

  if (!generated) {
    throw new Error('Failed to generate a complete Sudoku grid.');
  }

  const puzzle = createPuzzleGrid(solution, REMOVALS[mode]);

  return { solution, puzzle };
};

export const generateCells = (puzzle: Cell[][]): Cell[][] => {
  const cellsPerBox = Array.from({ length: GRID_SIZE }, () => [] as Cell[]);
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = puzzle[r][c];
      const boxIndex =
        Math.floor(r / BOX_SIZE) * BOX_SIZE + Math.floor(c / BOX_SIZE);

      cellsPerBox[boxIndex].push(cell);
    }
  }
  return cellsPerBox;
};
