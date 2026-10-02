'use client';

import { SimpleGrid, SimpleGridProps } from '@chakra-ui/react';

/**
 * This component renders the base grid layout for the Sudoku board
 */
export const SudokuGrid = ({
  ...props
}: React.PropsWithChildren<SimpleGridProps>) => {
  return (
    <SimpleGrid
      w="full"
      aspectRatio="1/1"
      position="relative"
      columns={3}
      p={0.5}
      gap={0.5}
      bg="bg.inverted"
      tabIndex={0}
      _focus={{ boxShadow: 'none', outline: 'none' }}
      {...props}
    />
  );
};
