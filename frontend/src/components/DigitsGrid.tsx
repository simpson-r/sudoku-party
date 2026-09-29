'use client';

import { LuPencil, LuNotebookPen } from 'react-icons/lu';

import {
  Flex,
  Icon,
  SimpleGrid,
  Tabs,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';

import { CellFill } from './SudokuGrid/types';
import { getCandidatePlacement } from './SudokuGrid/helpers';
import { SudokuDigit } from '@shared/types';
import { Tooltip } from './ui/tooltip';

// constants
const TAB_ITEMS = [
  { icon: <LuPencil />, label: 'Digits', value: 'digit' },
  { icon: <LuNotebookPen />, label: 'Candidates', value: 'candidate' },
];
// types
type DigitsGridProps = {
  counts: Record<SudokuDigit, number>;
  disabled?: boolean;
  fillMode: CellFill;
  onValueClick?: (value: SudokuDigit) => void;
  onTabChange?: (mode: CellFill) => void;
};

/**
 * This component displays digit controls for entering values or candidates, along with the remaining count for each digit.
 */
export const DigitsGrid = ({
  counts,
  disabled = false,
  fillMode,
  onValueClick,
  onTabChange,
}: React.PropsWithChildren<DigitsGridProps>) => {
  const isTablet = useBreakpointValue({ base: true, lg: false });

  return (
    <VStack
      opacity={disabled ? 0.5 : 1}
      pointerEvents={disabled ? 'none' : undefined}
    >
      {/* tabs */}
      <Tabs.Root
        w="full"
        value={fillMode}
        variant="subtle"
        onValueChange={(e) => onTabChange?.(e.value as CellFill)}
        h="10"
      >
        <Tabs.List w="full">
          {TAB_ITEMS.map(({ label, value, icon }) => (
            <Tooltip
              content={label}
              positioning={{ placement: 'top' }}
              disabled={isTablet}
            >
              <Tabs.Trigger
                key={value}
                value={value}
                flex={1}
                justifyContent="center"
                borderRadius="none"
                textTransform='lowercase'
                disabled={disabled}
                _selected={{ color: 'bg', bgColor: 'gray.solid' }}
              >
                {isTablet ? label : <Icon size="md">{icon}</Icon>}
              </Tabs.Trigger>
            </Tooltip>
          ))}
        </Tabs.List>
      </Tabs.Root>
      {/* digits grid */}
      <SimpleGrid columns={{ base: 9, lg: 3 }} gap={{ base: 1, lg: 3 }}>
        {Object.entries(counts).map(([num, remaining]) => (
          <Flex
            key={`${num}-count`}
            w={{ base: 8, sm: 10, md: 12, lg: 16 }}
            aspectRatio="square"
            position="relative"
            justify="center"
            align="center"
            bgColor="bg.muted"
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
    </VStack>
  );
};
