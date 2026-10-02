import { LuNotebookPen, LuPencil } from 'react-icons/lu';

import { Icon, Tabs, VStack } from '@chakra-ui/react';

import { DigitsGrid } from '@/components/DigitsGrid';
import { CellFill } from '@/components/SudokuGrid/types';
import { useBreakpoints } from '@/hooks/use-device-breakpoints';
import { SudokuDigit } from '@sudokuparty/shared/types';
import { Tooltip } from './ui/tooltip';

// constants
const TAB_ITEMS = [
  { icon: <LuPencil />, label: 'Digits', value: 'digit' },
  { icon: <LuNotebookPen />, label: 'Candidates', value: 'candidate' },
];

/**
 * This component renders controls panel for game actions, fill mode selection, and digit input.
 */
export const Controls = ({
  fillMode,
  remaining,
  disabled = false,
  handleTabChange,
  handleValueClick,
}: {
  fillMode: CellFill;
  disabled?: boolean;
  remaining: Record<SudokuDigit, number>;
  handleTabChange?: (mode: CellFill) => void;
  handleValueClick?: (digit: SudokuDigit) => void;
}) => {
  const { isCompactLayout } = useBreakpoints();
  return (
    <VStack
      w="full"
      opacity={disabled ? 0.7 : 1}
      pointerEvents={disabled ? 'none' : undefined}
    >
      {/* tabs */}
      <Tabs.Root
        w="full"
        value={fillMode}
        variant="subtle"
        onValueChange={(e) => {
          const value =
            e.value ?? (fillMode === 'candidate' ? 'digit' : 'candidate');

          handleTabChange?.(value as CellFill);
        }}
        deselectable
      >
        <Tabs.List w="full">
          {TAB_ITEMS.map(({ label, value, icon }) => (
            <Tooltip
              key={value}
              content={label}
              positioning={{ placement: 'top' }}
              disabled={isCompactLayout}
            >
              <Tabs.Trigger
                value={value}
                h={{ base: 8, lg: 10 }}
                flex={1}
                justifyContent="center"
                borderRadius="none"
                textTransform="lowercase"
                disabled={disabled}
                _selected={{ color: 'fg' }}
              >
                {isCompactLayout ? label : <Icon size="md">{icon}</Icon>}
              </Tabs.Trigger>
            </Tooltip>
          ))}
        </Tabs.List>
      </Tabs.Root>
      {/* digits/candidates */}
      <DigitsGrid
        counts={remaining}
        fillMode={fillMode}
        disabled={disabled}
        onValueClick={handleValueClick}
      />
    </VStack>
  );
};
