'use client';

import { useCallback, useEffect, useState } from 'react';

import { GRID_SIZE } from './constants';
import { SudokuBox } from './SudokuBox';
import { SudokuGrid } from './SudokuGrid';
import { Cell } from './types';

type Direction = {
  dr: number;
  dc: number;
};

const directions: Partial<Record<string, Direction>> = {
  ArrowLeft: { dr: 0, dc: -1 },
  ArrowRight: { dr: 0, dc: 1 },
  ArrowUp: { dr: -1, dc: 0 },
  ArrowDown: { dr: 1, dc: 0 },
};

export const SudokuBoard = ({
  cellsPerBox,
  puzzle,
  clearCell,
  fillCell,
}: {
  cellsPerBox: Cell[][];
  puzzle: Cell[][];
  clearCell: (value: number) => void;
  fillCell: (value: number) => void;
}) => {
  const [selectedCell, setSelectedCell] = useState<Cell | undefined>();

  /** handlers */
  const handleCellSelect = (cell: Cell) => setSelectedCell(cell);

  const handleArrowKey = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const direction = directions[e.key];
      if (!direction) return;
      e.preventDefault();

      const nextRow = (selectedCell.row + direction.dr + GRID_SIZE) % GRID_SIZE;
      const nextCol = (selectedCell.col + direction.dc + GRID_SIZE) % GRID_SIZE;
      setSelectedCell(puzzle[nextRow][nextCol]);
    },
    [selectedCell, puzzle],
  );

  const handleCellFill = (cell: Cell, value: number) => fillCell(value); // update cell state

  const handleCellClear = (cell: Cell) => {
    clearCell(cell.value ?? 0);
  };

  /** effects */
  useEffect(() => {
    document.addEventListener('keydown', handleArrowKey);
    return () => document.removeEventListener('keydown', handleArrowKey);
  }, [handleArrowKey]);

  /** render */
  return (
    <SudokuGrid>
      {Array.from({ length: GRID_SIZE }).map((_, boxIndex) => (
        <SudokuBox
          key={boxIndex}
          cells={cellsPerBox[boxIndex]}
          selected={selectedCell}
          onCellClear={handleCellClear}
          onCellFill={handleCellFill}
          onCellSelect={handleCellSelect}
        />
      ))}
    </SudokuGrid>
  );
};
