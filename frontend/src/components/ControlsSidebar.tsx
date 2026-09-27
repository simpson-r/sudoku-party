import { Button, Flex, HStack, VStack } from '@chakra-ui/react';

import { DigitsGrid } from '@/components/DigitsGrid';
import { CellFill, GameAction } from '@/components/SudokuGrid/types';
import { SudokuDigit } from '@shared/types';

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
        <HStack justify="center" gap="2">
          <Button
            flex="1"
            size="sm"
            variant="surface"
            onClick={() => handleGameAction('restart')}
          >
            Restart
          </Button>
          <Button
            flex="1"
            size="sm"
            variant="outline"
            onClick={() => handleGameAction('newGame')}
          >
            New Game
          </Button>
        </HStack>
        <DigitsGrid
          counts={remaining}
          fillMode={fillMode}
          onValueClick={handleValueClick}
          onTabChange={handleTabChange}
        />
      </VStack>
    </Flex>
  );
};
