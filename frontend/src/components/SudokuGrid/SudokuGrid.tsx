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
      position="relative"
      w={{ base: 'sm', md: 'lg' }}
      h="full"
      columns={3}
      p={1}
      gap={1}
      bg="bg.inverted"
      tabIndex={0}
      _focus={{ boxShadow: 'none', outline: 'none' }}
      {...props}
    />
  );
};
