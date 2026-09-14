'use client';

import { SimpleGrid, SimpleGridProps } from '@chakra-ui/react';
import { SudokuCell } from './SudokuCell';
import { Cell } from './types';

interface SudokuBoxProps {
  cells: Cell[];
  selected?: Cell;
  onCellClear: (cell: Cell) => void;
  onCellFill: (cell: Cell, val: number) => void;
  onCellSelect: (cell: Cell) => void;
}

export const SudokuBox = ({
  cells,
  selected,
  onCellSelect,
  onCellFill,
  onCellClear,
  ...props
}: React.PropsWithChildren<SimpleGridProps & SudokuBoxProps>) => {
  const withinBox = cells.some(
    (cell) => cell.row === selected?.row && cell.col === selected?.col,
  );
  return (
    <SimpleGrid
      w="full"
      h="full"
      bg="gray.border"
      columns={3}
      gap="1px"
      {...props}
    >
      {cells.map((cell) => (
        <SudokuCell
          key={`${cell.row}-${cell.col}`}
          cell={cell}
          selected={selected?.row === cell.row && selected?.col === cell.col}
          highlighted={
            selected?.row === cell.row ||
            selected?.col === cell.col ||
            withinBox
          }
          identical={!!selected?.value && cell.value === selected?.value}
          onClick={() => onCellSelect(cell)}
          onCellFill={onCellFill}
          onCellClear={onCellClear}
        />
      ))}
    </SimpleGrid>
  );
};
