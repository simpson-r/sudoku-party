'use client'
import { SimpleGrid, SimpleGridProps } from '@chakra-ui/react';

export const SudokuGrid = ({
  ...props
}: React.PropsWithChildren<SimpleGridProps>) => {
  return (
    <SimpleGrid
      w="xl"
      h="full"
      bg="bg.inverted"
      columns={3}
      p={0.5}
      gap={0.5}
      {...props}
    />
  );
};
