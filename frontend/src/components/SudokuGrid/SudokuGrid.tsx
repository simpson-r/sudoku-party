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
      w={{ base: 'md', md: 'lg', lg: 'xl' }}
      aspectRatio="1/1"
      position="relative"
      columns={3}
      p="0.18rem"
      gap="0.18rem"
      bg="bg.inverted"
      tabIndex={0}
      _focus={{ boxShadow: 'none', outline: 'none' }}
      {...props}
    />
  );
};
