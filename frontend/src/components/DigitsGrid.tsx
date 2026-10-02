'use client';

import { Flex, SimpleGrid, Stack, Text } from '@chakra-ui/react';

import { RemainingCounts, SudokuDigit } from '@sudokuparty/shared/types';
import { useBreakpoints } from '@/hooks/use-device-breakpoints';
import { CellFill } from './SudokuGrid/types';
import { getCandidatePlacement } from './SudokuGrid/helpers';

// types
type DigitsGridProps = {
  counts: RemainingCounts;
  disabled?: boolean;
  fillMode: CellFill;
  onValueClick?: (value: SudokuDigit) => void;
};

/**
 * This component displays digit controls for entering values or candidates, along with the remaining count for each digit.
 */
export const DigitsGrid = ({
  counts,
  disabled: isDisabled = false,
  fillMode,
  onValueClick,
}: React.PropsWithChildren<DigitsGridProps>) => {
  const { isCompactLayout, isNarrowLayout } = useBreakpoints();

  return (
    <SimpleGrid
      w="full"
      columns={{ base: 9, lg: 3 }}
      gap={{ base: 1, lg: 3 }}
      alignItems="center"
      justifyContent="center"
    >
      {Object.entries(counts).map(([num, remaining]) => {
        const value = Number(num) as SudokuDigit;
        const exhausted = remaining === 0;
        const disabled = isDisabled || exhausted;
        const color = exhausted ? 'fg.subtle' : 'fg';

        return (
          <Flex
            key={value}
            w="full"
            aspectRatio="square"
            position="relative"
            justify="center"
            align="center"
            bgColor="bg.subtle"
            border="1.5px solid"
            borderRadius="none"
            borderColor="border"
            _hover={disabled ? undefined : { borderColor: 'border.inverted' }}
            cursor={disabled ? 'default' : 'pointer'}
            onClick={disabled ? undefined : () => onValueClick?.(value)}
          >
            {fillMode === 'digit' ? (
              <Stack align="center" gap={1}>
                <Text
                  fontSize={{ base: 'sm', md: 'lg', lg: '2xl' }}
                  color={color}
                >
                  {value}
                </Text>

                {(!exhausted || isNarrowLayout) && (
                  <Text
                    fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}
                    color={exhausted ? 'fg.subtle' : 'fg.muted'}
                    position={{ base: 'relative', md: 'absolute' }}
                    top={{ base: 'auto', md: 0 }}
                    right={{ base: 'auto', md: 2 }}
                  >
                    {remaining}
                  </Text>
                )}
              </Stack>
            ) : (
              <Text
                position="absolute"
                fontSize={{ base: 'xs', sm: 'sm' }}
                color={color}
                {...(!isCompactLayout
                  ? getCandidatePlacement(value, 3, 1)
                  : {})}
              >
                {value}
              </Text>
            )}
          </Flex>
        );
      })}
    </SimpleGrid>
  );
};
