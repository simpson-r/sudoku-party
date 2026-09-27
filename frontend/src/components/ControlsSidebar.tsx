import { Button, ButtonProps, Flex, HStack, VStack } from '@chakra-ui/react';

import { DigitsGrid } from '@/components/DigitsGrid';
import { CellFill, GameAction } from '@/components/SudokuGrid/types';
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
  handleGameAction,
  handleTabChange,
  handleValueClick,
}: {
  fillMode: CellFill;
  remaining: Record<SudokuDigit, number>;
  handleGameAction: (action: GameAction) => void;
  handleTabChange: (mode: CellFill) => void;
  handleValueClick: (digit: SudokuDigit) => void;
}) => {
  return (
    <Flex
      flex="1"
      direction="column"
      justify="center"
      align="flex-start"
      pl="6"
      gap={4}
    >
      <VStack gap={4} align="stretch" maxW="60">
        <DigitsGrid
          counts={remaining}
          fillMode={fillMode}
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
      </VStack>
    </Flex>
  );
};
