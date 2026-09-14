'use client';
import { useCallback, useEffect, useMemo } from 'react';

import { BoxProps, Center } from '@chakra-ui/react';
import { Cell } from './types';

interface SudokuCellProps {
  cell: Cell;
  highlighted?: boolean;
  identical?: boolean;
  selected: boolean;
  onCellClear: (cell: Cell) => void;
  onCellFill: (cell: Cell, val: number) => void;
}
export const SudokuCell = ({
  cell,
  highlighted = false,
  identical = false,
  selected,
  onCellClear,
  onCellFill,
  ...props
}: SudokuCellProps & BoxProps) => {
  const { given, actual, value } = cell;

  /** style */
  const color = given
    ? 'fg'
    : value !== null && value !== actual
      ? 'fg.error'
      : 'fg.info';

  const bgColor = useMemo(() => {
    switch (true) {
      case selected:
      case identical:
        return 'blue.muted';
      case highlighted:
        return 'bg.info';
      case given:
        return 'bg.panel';
      default:
        return 'bg';
    }
  }, [given, highlighted, identical, selected]);

  /** handlers */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selected || given) return;

      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();

        const val = Number(e.key);
        onCellFill(cell, val);
      }
      if ((e.key === 'Backspace' || e.key === 'Delete') && value) {
        e.preventDefault();

        onCellClear(cell);
      }
    },
    [cell, given, selected, value, onCellClear, onCellFill],
  );

  /** effects */
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Center
      w="full"
      h="full"
      bg={bgColor}
      aspectRatio="1/1"
      fontSize="3xl"
      cursor="pointer"
      userSelect="none"
      border={selected ? '3px solid' : undefined}
      borderColor="border.info"
      color={color}
      {...props}
    >
      {value ?? ''}
    </Center>
  );
};
