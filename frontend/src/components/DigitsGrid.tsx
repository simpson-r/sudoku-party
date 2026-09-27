'use client';

import { LuPencil, LuNotebookPen } from 'react-icons/lu';

import { Flex, SimpleGrid, Tabs, Text, VStack } from '@chakra-ui/react';

import { CellFill } from './SudokuGrid/types';
import { getCandidatePlacement } from './SudokuGrid/helpers';
import { SudokuDigit } from '@shared/types';
import { Tooltip } from './ui/tooltip';

const TAB_ITEMS = [
  { icon: <LuPencil />, label: 'Normal', value: 'digit' },
  { icon: <LuNotebookPen />, label: 'Candidate', value: 'candidate' },
];
/**
 * This component displays digit controls for entering values or candidates, along with the remaining count for each digit.
 */
export const DigitsGrid = ({
  fillMode,
  counts,
  onValueClick,
  onTabChange,
}: React.PropsWithChildren<{
  fillMode: CellFill;
  counts: Record<SudokuDigit, number>;
  onValueClick: (val: SudokuDigit) => void;
  onTabChange: (mode: CellFill) => void;
}>) => {
  return (
    <VStack>
      {/* tabs */}
      <Tabs.Root
        w="full"
        value={fillMode}
        variant="subtle"
        onValueChange={(e) => onTabChange(e.value as CellFill)}
      >
        <Tabs.List w="full">
          {TAB_ITEMS.map(({ value, icon }) => (
            <Tooltip content={value} positioning={{ placement: 'top' }}>
              <Tabs.Trigger
                key={value}
                value={value}
                justifyContent="center"
                flex="1"
                _selected={{ color: 'bg', bgColor: 'bg.inverted' }}
              >
                {icon}
              </Tabs.Trigger>
            </Tooltip>
          ))}
        </Tabs.List>
      </Tabs.Root>
      {/* digits grid */}
      <SimpleGrid columns={3} gap={3}>
        {Object.entries(counts).map(([num, remaining]) => (
          <Flex
            key={`${num}-count`}
            w={{ base: 12, md: 16 }}
            aspectRatio="square"
            position="relative"
            justify="center"
            align="center"
            bgColor="bg.muted"
            border="1px solid"
            borderRadius="md"
            borderColor="border"
            cursor="pointer"
            onClick={() => onValueClick(Number(num) as SudokuDigit)}
          >
            {fillMode === 'digit' ? (
              // digit
              <>
                <Text
                  fontSize={{ base: 'lg', md: '2xl' }}
                  color={!!remaining ? 'fg' : 'fg.subtle'}
                >
                  {num}
                </Text>
                {Boolean(remaining) && (
                  <Text
                    fontSize={{ base: 'xs', md: 'sm' }}
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
                fontSize={{ base: 'xs', md: 'md' }}
                color={!!remaining ? 'fg' : 'fg.subtle'}
                {...getCandidatePlacement(num as unknown as SudokuDigit, 3, 1)}
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
