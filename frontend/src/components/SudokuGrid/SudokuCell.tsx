'use client';
import { useCallback, useEffect, useMemo } from 'react';

import { BoxProps, Center, Text } from '@chakra-ui/react';
import { Cell, SudokuDigit } from './types';
import { CANDIDATE_POSITION } from './constants';

interface SudokuCellProps {
  cell: Cell;
  highlighted?: boolean;
  identical?: boolean;
  paused?: boolean;
  selected: boolean;
  onCellClear: (cell: Cell) => void;
  onCellFill: (cell: Cell, digit: SudokuDigit) => void;
}
/**
 * This component renders an individual Sudoku grid cell. It manages visual highlights (selection, errors, candidates) 
 * and binds keyboard listeners (1–9 to fill, Backspace/Delete to clear) when selected.
 */
export const SudokuCell = ({
  cell,
  highlighted = false,
  identical = false,
  paused = false,
  selected,
  onCellClear,
  onCellFill,
  ...props
}: SudokuCellProps & BoxProps) => {
  const { given, actual, value, candidates } = cell;

  /** styling */
  const color = useMemo(() => {
    if (given) return 'fg';
    if (value !== null && value !== actual) return 'fg.error';
    return 'fg.info';
  }, [given, value, actual]);

  const bgColor = useMemo(() => {
    switch (true) {
      case paused:
        return 'bg';
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
  }, [given, highlighted, identical, paused, selected]);

  /** callbacks */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selected || given || paused) return;

      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        onCellFill(cell, Number(e.key) as SudokuDigit);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        onCellClear(cell);
      }
    },
    [cell, given, paused, selected, onCellClear, onCellFill],
  );

  /** effects */
  useEffect(() => {
    if (!selected) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, handleKeyDown]);

  return (
    <Center
      w="full"
      h="full"
      position="relative"
      bg={bgColor}
      aspectRatio="1/1"
      cursor="pointer"
      userSelect="none"
      border={selected && !paused ? '3px solid' : undefined}
      borderColor="border.info"
      color={color}
      {...props}
    >
      {paused || !value ? (
        // candidates (only rendered when not paused and value is absent)
        !paused &&
        candidates?.map((candidate) => (
          <Text
            key={candidate}
            position="absolute"
            color="fg.muted"
            fontSize="xs"
            fontWeight="300"
            fontVariantNumeric="tabular-nums"
            {...CANDIDATE_POSITION(1, 0)[Number(candidate) as SudokuDigit]}
          >
            {candidate}
          </Text>
        ))
      ) : (
        // main digit
        <Text fontSize="2xl">{value}</Text>
      )}
    </Center>
  );
};
