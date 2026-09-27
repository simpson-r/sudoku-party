'use client';

import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

import { CountsGrid } from '../components/CountsGrid';
import { SettingsBar } from '../components/SettingsBar';
import { CompletionModal } from '../components/modals/CompletionModal';
import { ConfirmationModal } from '../components/modals/ConfirmationModal';
import { SudokuBoard } from '../components/SudokuGrid/SudokuBoard';
import { useSudokuGame } from '../hooks/use-sudoku-game';
import {
  Cell,
  CellFillMode,
  CellPosition,
  SudokuDigit,
} from '../components/SudokuGrid/types';

/** types */
type GameAction = 'reset' | 'restart';

/** constants */
const CONFIRM_CONFIG = {
  reset: {
    heading: 'Start a new game?',
    body: 'This will end the current session for everyone.',
    confirmText: 'New Game',
  },
  restart: {
    heading: 'Restart this game?',
    body: 'This will restart the current session for everyone.',
    confirmText: 'Restart',
  },
};

/**
 * This component coordinates the Sudoku game, including gameplay controls, board interactions, and game lifecycle modals.
 */
export const LandingPage = () => {
  const { state, time, actions } = useSudokuGame();
  const {
    clearCell,
    fillCell,
    pause,
    reset,
    resume,
    restart,
    addCandidate,
    removeCandidate,
  } = actions;

  const confirmationModal = useDisclosure();
  const completionModal = useDisclosure();

  const [confirmationMode, setConfirmationMode] = useState<GameAction>('reset');
  const [selectedPos, setSelectedPos] = useState<CellPosition | null>(null);
  const [fillMode, setFillMode] = useState<CellFillMode>('digit');

  const selectedCell = selectedPos
    ? state.board[selectedPos.row]?.[selectedPos.col]
    : null;

  /** modal handlers */
  const handleGameAction = (mode: GameAction) => {
    setConfirmationMode(mode);
    confirmationModal.onOpen();
  };

  const handleConfirm = () => {
    if (confirmationMode === 'reset') reset();
    else restart();

    confirmationModal.onClose();
  };

  const handleCompletionReset = () => {
    reset();
    completionModal.onClose();
  };

  /** cell handlers */
  const handleCellSelection = (cell: Cell) =>
    setSelectedPos({ row: cell.row, col: cell.col });

  const handleDigitInput = (digit: SudokuDigit) => {
    if (!selectedPos) return;

    const payload = { ...selectedPos, value: digit };
    if (fillMode === 'digit') {
      fillCell(payload);
    } else {
      addCandidate(payload);
    }
  };

  const handleDigitRemoval = (digit: SudokuDigit | null) => {
    if (!selectedCell || !selectedPos) return;

    if (selectedCell.value && digit) {
      clearCell({ ...selectedPos, value: digit });
      return;
    }

    if (selectedCell.candidates?.length || digit) {
      removeCandidate({
        ...selectedPos,
        candidates: digit ? [digit] : (selectedCell.candidates ?? []),
      });
    }
  };

  const handleValueClick = (digit: SudokuDigit) => {
    if (!selectedCell) return;

    const digitMatch = fillMode === 'digit' && selectedCell.value === digit;
    const candidateMatch =
      fillMode === 'candidate' && selectedCell.candidates?.includes(digit);

    if (digitMatch || candidateMatch) {
      handleDigitRemoval(digit);
    } else {
      handleDigitInput(digit);
    }
  };

  /** effects */
  useEffect(() => {
    if (state.completed) completionModal.onOpen();
  }, [state.completed, completionModal]);

  return (
    <Container
      as={VStack}
      w="full"
      h="full"
      alignItems="center"
      justifyContent="center"
      pb={3}
      gap={3}
    >
      <SettingsBar
        errors={state.errors}
        isPaused={state.paused}
        hidePauseToggle={state.completed}
        time={time}
        pause={pause}
        resume={resume}
      />
      <Flex w="full" align="flex-start" justify="center">
        {/* left spacer */}
        <Box flex="1" />

        <SudokuBoard
          puzzle={state.board}
          isPaused={state.paused}
          clearCell={handleDigitRemoval}
          fillCell={handleDigitInput}
          resume={resume}
          onCellSelect={handleCellSelection}
        />
        {/* right controls */}
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
                variant="solid"
                onClick={() => handleGameAction('restart')}
              >
                Restart
              </Button>
              <Button
                flex="1"
                size="sm"
                variant="surface"
                onClick={() => handleGameAction('reset')}
              >
                New Game
              </Button>
            </HStack>
            <CountsGrid
              counts={state.remaining}
              cellFillMode={fillMode}
              onValueClick={handleValueClick}
              onTabChange={setFillMode}
            />
          </VStack>
        </Flex>
      </Flex>
      <CompletionModal
        difficulty="easy"
        errors={state.errors}
        isOpen={completionModal.open}
        time={time}
        onClose={completionModal.onClose}
        onNewGame={handleCompletionReset}
      />
      <ConfirmationModal
        ctaConfig={CONFIRM_CONFIG[confirmationMode]}
        isOpen={confirmationModal.open}
        onClose={confirmationModal.onClose}
        onConfirm={handleConfirm}
      />
    </Container>
  );
};
