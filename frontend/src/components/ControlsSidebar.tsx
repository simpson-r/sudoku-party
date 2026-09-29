import { Flex } from '@chakra-ui/react';

import { DigitsGrid } from '@/components/DigitsGrid';
import { CellFill } from '@/components/SudokuGrid/types';
import { SudokuDigit } from '@shared/types';

const BUTTON_ITEMS = [
  { variant: 'surface', label: 'Restart', type: 'restart' },
  { variant: 'outline', label: 'New Game', type: 'newGame' },
];
/**
 * This component renders controls panel for game actions, fill mode selection, and digit input.
 */
export const ControlsSidebar = ({
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
  return (
    <Flex direction="column" justify="center" align="flex-start" gap={4}>
      <DigitsGrid
        counts={remaining}
        fillMode={fillMode}
        disabled={disabled}
        onValueClick={handleValueClick}
        onTabChange={handleTabChange}
      />
      {/* <HStack justify="center" gap="2">
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
        </HStack> */}
    </Flex>
  );
};
