'use client';

import { Flex, SimpleGrid, Stack, Text } from '@chakra-ui/react';

import { CellFill } from './SudokuGrid/types';
import { getCandidatePlacement } from './SudokuGrid/helpers';
import { SudokuDigit } from '@sudokuparty/shared/types';
import { useBreakpoints } from '@/hooks/use-device-breakpoints';

// types
type DigitsGridProps = {
  counts: Record<SudokuDigit, number>;
  disabled?: boolean;
  fillMode: CellFill;
  onValueClick?: (value: SudokuDigit) => void;
};

/**
 * This component displays digit controls for entering values or candidates, along with the remaining count for each digit.
 */
export const DigitsGrid = ({
  counts,
  disabled = false,
  fillMode,
  onValueClick,
}: React.PropsWithChildren<DigitsGridProps>) => {
  const { isTablet } = useBreakpoints();

  return (
    <SimpleGrid
      w="full"
      columns={{ base: 9, lg: 3 }}
      gap={{ base: 1, lg: 3 }}
      alignItems="center"
      justifyContent="center"
    >
      {Object.entries(counts).map(([num, remaining]) => (
        <Flex
          key={`${num}-count`}
          w="full"
          aspectRatio="square"
          position="relative"
          justify="center"
          align="center"
          bgColor="bg.subtle"
          border="2px solid"
          borderRadius="none"
          borderColor="border"
          _hover={disabled ? undefined : { borderColor: 'border.inverted' }}
          cursor={disabled ? undefined : 'pointer'}
          onClick={() => onValueClick?.(Number(num) as SudokuDigit)}
        >
          {fillMode === 'digit' ? (
            // digit
            <Stack direction="column" align="center" gap={1}>
              <Text
                fontSize={{ base: 'sm', md: 'lg', lg: '2xl' }}
                color={!!remaining ? 'fg' : 'fg.subtle'}
              >
                {num}
              </Text>
              {Boolean(remaining) && (
                <Text
                  fontSize={{ base: '2xs', md: 'xs', lg: 'sm' }}
                  color="fg.muted"
                  position={{ base: 'relative', md: 'absolute' }}
                  top={{ base: 'auto', md: 0 }}
                  right={{ base: 'auto', md: 2 }}
                >
                  {remaining}
                </Text>
              )}
            </Stack>
          ) : (
            // candidate
            <Text
              position="absolute"
              fontSize={{ base: 'xs', lg: 'sm' }}
              color={!!remaining ? 'fg' : 'fg.subtle'}
              {...(!isTablet
                ? getCandidatePlacement(num as unknown as SudokuDigit, 3, 1)
                : {})}
            >
              {num}
            </Text>
          )}
        </Flex>
      ))}
    </SimpleGrid>
  );
};
