'use client';

import { useCallback, useMemo, useState } from 'react';
import { IoPlayCircle } from 'react-icons/io5';

import { Center, Icon, SimpleGridProps, Spinner } from '@chakra-ui/react';

import { SudokuBox } from '@/components/SudokuGrid/SudokuBox';
import { SudokuGrid } from '@/components/SudokuGrid/SudokuGrid';
import {
  createEmptyBoard,
  generateCellsPerBox,
} from '@/components/SudokuGrid/helpers';
import { Cell, CellPosition, SudokuDigit } from '@shared/types';
import { GRID_SIZE } from '@shared/constants';

// types
type Direction = { dr: number; dc: number };
type SudokuBoardProps =
  | {
      puzzle?: Cell[][];
      placeholder?: false;
      isPaused?: boolean;
      clearCell: (digit: SudokuDigit | null) => void;
      fillCell: (digit: SudokuDigit) => void;
      onCellSelect: (pos: CellPosition) => void;
      resume?: VoidFunction;
    }
  | { puzzle: undefined };

// constants
const directions: Partial<Record<string, Direction>> = {
  ArrowLeft: { dr: 0, dc: -1 },
  ArrowRight: { dr: 0, dc: 1 },
  ArrowUp: { dr: -1, dc: 0 },
  ArrowDown: { dr: 1, dc: 0 },
};
const EMPTY_BOARD = createEmptyBoard();

/**
 * This component renders the sudoku board and manages board-level interactions like cell selection, keyboard nav, and resume
 */
export const SudokuBoard = (props: SudokuBoardProps & SimpleGridProps) => {
  const puzzle = !props.puzzle ? EMPTY_BOARD : props.puzzle;
  const cellsPerBox = useMemo(() => generateCellsPerBox(puzzle), [puzzle]);

  // render non-interactive board for loading state
  if (!props.puzzle) {
    return (
      <SudokuGrid>
        {Array.from({ length: GRID_SIZE }).map((_, boxIndex) => (
          <SudokuBox
            key={boxIndex}
            cells={cellsPerBox[boxIndex]}
            selectedCell={undefined}
            paused={true}
            onCellClear={undefined}
            onCellFill={undefined}
            onCellSelect={undefined}
          />
        ))}
        <Center position="absolute" inset="0" zIndex={1}>
          <Spinner />
        </Center>
      </SudokuGrid>
    );
  }

  const { isPaused, clearCell, fillCell, resume, onCellSelect, ...rest } =
    props;

  const [selectedPosition, setSelectedPosition] = useState<CellPosition | null>(
    null,
  );

  const selectedCell = selectedPosition
    ? puzzle[selectedPosition.row][selectedPosition.col]
    : undefined;

  // handlers
  const handleCellSelect = useCallback(
    (pos: CellPosition) => {
      setSelectedPosition(pos);
      onCellSelect(pos);
    },
    [onCellSelect],
  );

  const handleArrowKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (!selectedPosition || isPaused) return;

      const direction = directions[e.key];
      if (!direction) return;

      e.preventDefault();

      const nextRow =
        (selectedPosition.row + direction.dr + GRID_SIZE) % GRID_SIZE;
      const nextCol =
        (selectedPosition.col + direction.dc + GRID_SIZE) % GRID_SIZE;

      const pos = puzzle[nextRow][nextCol];
      handleCellSelect({ row: pos.row, col: pos.col });
    },
    [isPaused, puzzle, selectedPosition, handleCellSelect],
  );

  // render
  return (
    <SudokuGrid onKeyDown={handleArrowKey} {...rest}>
      {Array.from({ length: GRID_SIZE }).map((_, boxIndex) => (
        <SudokuBox
          key={boxIndex}
          cells={cellsPerBox[boxIndex]}
          selectedCell={selectedCell}
          paused={isPaused}
          onCellClear={clearCell}
          onCellFill={fillCell}
          onCellSelect={handleCellSelect}
        />
      ))}
      {isPaused && (
        <Icon
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          boxSize={12}
          cursor="pointer"
          onClick={resume}
        >
          <IoPlayCircle />
        </Icon>
      )}
    </SudokuGrid>
  );
};
