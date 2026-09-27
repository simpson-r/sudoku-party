'use client';
import { useCallback, useEffect, useMemo } from 'react';

import { BoxProps, Center, Text } from '@chakra-ui/react';

import { getCandidatePlacement } from '@/components/SudokuGrid/helpers';
import { Cell, SudokuDigit } from '@/components/SudokuGrid/types';

interface SudokuCellProps {
  cell: Cell;
  highlighted?: boolean;
  identical?: boolean;
  paused?: boolean;
  selected: boolean;
  onCellClear: (digit: SudokuDigit | null) => void;
  onCellFill: (digit: SudokuDigit) => void;
}
/**
 * This component renders an individual Sudoku grid cell. It manages visual highlights (selection, errors, candidates)
 * and binds keyboard listeners when selected.
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
  // cell styling 
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

  // callbacks
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selected || given || paused) return;

      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        onCellFill(Number(e.key) as SudokuDigit);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        onCellClear(value);
      }
    },
    [given, paused, selected, value, onCellClear, onCellFill],
  );

  // effects
  useEffect(() => {
    if (!selected) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, handleKeyDown]);

  // render
  return (
    <Center
      w="full"
      h="full"
      position="relative"
      bg={bgColor}
      aspectRatio="1/1"
      cursor="pointer"
      userSelect="none"
      border="3px solid"
      borderColor={selected && !paused ? 'border.info' : 'transparent'}
      color={color}
      {...props}
    >
      {paused || !value ? (
        // candidates
        !paused &&
        candidates?.map((candidate) => (
          <Text
            key={candidate}
            position="absolute"
            fontSize="xs"
            fontVariantNumeric="tabular-nums"
            color="gray.500"
            {...getCandidatePlacement(Number(candidate) as SudokuDigit, 1, 0)}
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
