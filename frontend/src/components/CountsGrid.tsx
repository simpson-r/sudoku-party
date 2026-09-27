'use client';

import { Flex, SimpleGrid, Tabs, Text, VStack } from '@chakra-ui/react';
import { LuPencil, LuPenLine } from 'react-icons/lu';
import { CellFillMode, SudokuDigit } from './SudokuGrid/types';
import { CANDIDATE_POSITION } from './SudokuGrid/constants';

/**
 * This component displays digit controls for entering values or candidates, along with the remaining count for each digit.
 */
export const CountsGrid = ({
  cellFillMode,
  counts,
  onValueClick,
  onTabChange,
}: React.PropsWithChildren<{
  cellFillMode: CellFillMode;
  counts: Record<SudokuDigit, number>;
  onValueClick: (val: SudokuDigit) => void;
  onTabChange: (mode: CellFillMode) => void;
}>) => {
  return (
    <VStack>
      {/* tabs */}
      <Tabs.Root
        value={cellFillMode}
        variant="enclosed"
        onValueChange={(e) => onTabChange(e.value as CellFillMode)}
      >
        <Tabs.List>
          <Tabs.Trigger value="digit" _selected={{ color: 'bg.inverted' }}>
            <LuPenLine />
            Normal
          </Tabs.Trigger>
          <Tabs.Trigger value="candidate" _selected={{ color: 'bg.inverted' }}>
            <LuPencil />
            Candidate
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
      {/* value/candidate grid */}
      <SimpleGrid columns={3} gap={3}>
        {Object.entries(counts).map(([num, remaining]) => (
          <Flex
            key={`${num}-count`}
            w="16"
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
            {cellFillMode === 'digit' ? (
              <>
                <Text fontSize="3xl" color={!!remaining ? 'fg' : 'fg.subtle'}>
                  {num}
                </Text>
                {Boolean(remaining) && (
                  <Text
                    fontSize="sm"
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
              <Text
                position="absolute"
                fontSize="md"
                fontWeight="bold"
                color={!!remaining ? 'fg' : 'fg.subtle'}
                {...CANDIDATE_POSITION(2, 1)[Number(num) as SudokuDigit]}
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
