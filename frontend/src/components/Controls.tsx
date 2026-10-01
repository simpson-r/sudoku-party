import { Icon, Tabs, VStack } from '@chakra-ui/react';

import { DigitsGrid } from '@/components/DigitsGrid';
import { CellFill } from '@/components/SudokuGrid/types';
import { SudokuDigit } from '@shared/types';
import { LuNotebookPen, LuPencil } from 'react-icons/lu';
import { Tooltip } from './ui/tooltip';
import { useBreakpoints } from '@/hooks/use-device-breakpoints';

// constants
const TAB_ITEMS = [
  { icon: <LuPencil />, label: 'Digits', value: 'digit' },
  { icon: <LuNotebookPen />, label: 'Candidates', value: 'candidate' },
];
const BUTTON_ITEMS = [
  { variant: 'surface', label: 'Restart', type: 'restart' },
  { variant: 'outline', label: 'New Game', type: 'newGame' },
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
  const { isMobile } = useBreakpoints();
  return (
    <VStack
      w="full"
      opacity={disabled ? 0.5 : 1}
      pointerEvents={disabled ? 'none' : undefined}
    >
      {/* tabs */}
      <Tabs.Root
        w="full"
        value={fillMode}
        variant="subtle"
        onValueChange={(e) => handleTabChange?.(e.value as CellFill)}
      >
        <Tabs.List w="full">
          {TAB_ITEMS.map(({ label, value, icon }) => (
            <Tooltip
              key={value}
              content={label}
              positioning={{ placement: 'top' }}
              disabled={isMobile}
            >
              <Tabs.Trigger
                value={value}
                h={{ base: 8, lg: 10 }}
                flex={1}
                justifyContent="center"
                borderRadius="none"
                textTransform="lowercase"
                disabled={disabled}
                _selected={{ color: 'bg', bgColor: 'gray.solid' }}
              >
                {isMobile ? label : <Icon size="md">{icon}</Icon>}
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

/* <HStack justify="center" gap="2">
          {BUTTON_ITEMS.map(({ label, type, variant }) => (
            <Button
              key={type}
              aria-label={label}
              flex="1"
              size="sm"
              variant={variant as ButtonProps['variant']}
              onClick={() => handleGameAction(type as GameAction)}
            >
              {label}
            </Button>
          ))}
        </HStack> */
