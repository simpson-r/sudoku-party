'use client';

import { SimpleGrid } from '@chakra-ui/react';

import { SudokuCell } from '@/components/SudokuGrid/SudokuCell';
import { Cell, CellPosition, SudokuDigit } from '@shared/types';

interface SudokuBoxProps {
  cells: Cell[];
  paused?: boolean;
  selectedCell?: Cell;
  onCellClear: (digit: SudokuDigit | null) => void;
  onCellFill: (digit: SudokuDigit) => void;
  onCellSelect: (pos: CellPosition) => void;
}

/**
 * This component renders a 3×3 sudoku box and highlights cells based on the current selection
 */
export const SudokuBox = ({
  cells,
  selectedCell,
  onCellSelect,
  ...props
}: React.PropsWithChildren<SudokuBoxProps>) => {
  const selectedWithinBox = cells.some(
    (cell) => cell.row === selectedCell?.row && cell.col === selectedCell?.col,
  );

  return (
    <SimpleGrid columns={3} w="full" h="full" gap={0.5} bg="gray.border">
      {cells.map((cell) => (
        <SudokuCell
          key={`${cell.row}-${cell.col}`}
          cell={cell}
          selected={
            selectedCell?.row === cell.row && selectedCell?.col === cell.col
          }
          highlighted={
            selectedCell?.row === cell.row ||
            selectedCell?.col === cell.col ||
            selectedWithinBox
          }
          identical={
            !!selectedCell?.value && cell.value === selectedCell?.value
          }
          onClick={() => onCellSelect({ row: cell.row, col: cell.col })}
          {...props}
        />
      ))}
    </SimpleGrid>
  );
};
