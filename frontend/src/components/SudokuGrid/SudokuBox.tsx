'use client';

import { SimpleGrid, SimpleGridProps } from '@chakra-ui/react';
import { SudokuCell } from './SudokuCell';
import { Cell, SudokuDigit } from './types';

interface SudokuBoxProps {
  cells: Cell[];
  paused?: boolean;
  selected?: Cell;
  onCellClear: (cell: Cell) => void;
  onCellFill: (cell: Cell, digit: SudokuDigit) => void;
  onCellSelect: (cell: Cell) => void;
}

/** This component...
 * @todo
 */
export const SudokuBox = ({
  cells,
  selected,
  paused,
  onCellSelect,
  onCellFill,
  onCellClear,
  ...props
}: React.PropsWithChildren<SimpleGridProps & SudokuBoxProps>) => {
  const withinBox = cells.some(
    (cell) => cell.row === selected?.row && cell.col === selected?.col,
  );

  /** render */
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
          paused={paused}
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
