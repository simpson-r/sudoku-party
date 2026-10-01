'use client';

import { Flex, SimpleGrid, Text } from '@chakra-ui/react';

import { CellFill } from './SudokuGrid/types';
import { getCandidatePlacement } from './SudokuGrid/helpers';
import { SudokuDigit } from '@shared/types';
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
  const { isMobile } = useBreakpoints();

  return (
    <SimpleGrid
      w="full"
      columns={{ base: 9, md: 3 }}
      gap={{ base: 1, md: 3 }}
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
            <>
              <Text
                fontSize={{ base: 'md', md: 'lg', lg: '2xl' }}
                color={!!remaining ? 'fg' : 'fg.subtle'}
              >
                {num}
              </Text>
              {Boolean(remaining) && (
                <Text
                  fontSize={{ base: '2xs', md: 'xs', lg: 'sm' }}
                  color="fg.muted"
                  position="absolute"
                  top="0"
                  right="2"
                >
                  {remaining}
                </Text>
              )}
            </>
          ) : (
            // candidate
            <Text
              position="absolute"
              fontSize={{ base: 'xs', md: 'sm' }}
              color={!!remaining ? 'fg' : 'fg.subtle'}
              {...(!isMobile
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
