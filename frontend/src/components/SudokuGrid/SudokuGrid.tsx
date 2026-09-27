'use client';

import { SimpleGrid, SimpleGridProps } from '@chakra-ui/react';

/**
 * This component renders the base grid layout for the Sudoku board.
 */
export const SudokuGrid = ({
  ...props
}: React.PropsWithChildren<SimpleGridProps>) => {
  return (
    <SimpleGrid
      position="relative"
      w={{ base: 'sm', md: 'lg' }}
      h="full"
      bg="bg.inverted"
      columns={3}
      p={1}
      gap={1}
      tabIndex={0}
      {...props}
    />
  );
};
