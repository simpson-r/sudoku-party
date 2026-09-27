'use client';

import { useCallback, useEffect, useState } from 'react';

import { GRID_SIZE } from './constants';
import { SudokuBox } from './SudokuBox';
import { SudokuGrid } from './SudokuGrid';
import { Cell, SudokuDigit } from './types';
import { Icon, SimpleGridProps } from '@chakra-ui/react';
import { LuCirclePlay } from 'react-icons/lu';
import { generateCells } from '../../modules/game-generator';

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
  puzzle,
  isPaused,
  clearCell,
  fillCell,
  resume,
  onCellSelect,
  ...props
}: {
  puzzle: Cell[][];
  isPaused?: boolean;
  clearCell: (digit: SudokuDigit | null) => void;
  fillCell: (digit: SudokuDigit) => void;
  onCellSelect: (cell: Cell) => void;
  resume: VoidFunction;
} & SimpleGridProps) => {
  const [selectedCell, setSelectedCell] = useState<Cell | undefined>();
  const cellsPerBox = generateCells(puzzle);

  /** handlers */
  const handleCellSelect = (cell: Cell) => {
    setSelectedCell(cell);
    onCellSelect(cell);
  };

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

  const handleCellFill = (cell: Cell, value: SudokuDigit) => fillCell(value);
  const handleCellClear = (cell: Cell) => {
    console.log('helloooo');
    clearCell(cell.value);
  };

  /** effects */
  useEffect(() => {
    document.addEventListener('keydown', handleArrowKey);
    return () => document.removeEventListener('keydown', handleArrowKey);
  }, [handleArrowKey]);

  /** render */
  return (
    <SudokuGrid {...props}>
      {Array.from({ length: GRID_SIZE }).map((_, boxIndex) => (
        <SudokuBox
          key={boxIndex}
          cells={cellsPerBox[boxIndex]}
          selected={selectedCell}
          paused={isPaused}
          onCellClear={handleCellClear}
          onCellFill={handleCellFill}
          onCellSelect={handleCellSelect}
        />
      ))}
      {isPaused && (
        <Icon
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          size="2xl"
          color="fg.info"
          cursor="pointer"
          onClick={resume}
        >
          <LuCirclePlay />
        </Icon>
      )}
    </SudokuGrid>
  );
};
