import { BOX_SIZE, GRID_SIZE } from '@sudokuparty/shared/constants';
import { Cell, SudokuDigit } from '@sudokuparty/shared/types';

const getCandidatePlacements = (x?: number, y?: number) => ({
  1: { top: y, left: x },
  2: { top: y, left: '50%', transform: 'translateX(-50%)' },
  3: { top: y, right: x },
  4: { top: '50%', left: x, transform: 'translateY(-50%)' },
  5: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  6: { top: '50%', right: x, transform: 'translateY(-50%)' },
  7: { bottom: y, left: x },
  8: { bottom: y, left: '50%', transform: 'translateX(-50%)' },
  9: { bottom: y, right: x },
});

/**
 * Returns the absolute positioning styles for a candidate digit within a Sudoku cell
 *
 * @param x - horizontal inset from the cell edge
 * @param y - vertical inset from the cell edge
 */
export const getCandidatePlacement = (digit: SudokuDigit, x = 2, y = 1) =>
  getCandidatePlacements(x, y)[digit];

/**
 * Groups the cells of a sudoku grid into its 9 boxes
 * @param puzzle - sudoku grid represented as a 2D array of cells
 */
export const generateCellsPerBox = (puzzle: Cell[][]): Cell[][] => {
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

/**
 * Creates a 9×9 Sudoku board with empty cells.
 */
export const createEmptyBoard = (): Cell[][] =>
  Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: 9 }, (_, col) => ({
      row,
      col,
      value: null,
      actual: 1,
      candidates: null,
      given: false,
    })),
  );

/**
 * Updates remaining digit counts after a cell value changes.
 */
export const updateRemainingCounts = (
  remaining: Record<SudokuDigit, number>,
  prevValue: SudokuDigit | null,
  nextValue: SudokuDigit | null,
) => {
  const updated = { ...remaining };

  if (prevValue && prevValue !== nextValue) {
    updated[prevValue] += 1;
  }

  if (nextValue && prevValue !== nextValue) {
    updated[nextValue] -= 1;
  }

  return updated;
};
