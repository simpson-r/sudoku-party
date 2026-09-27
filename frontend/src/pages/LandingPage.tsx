'use client';

import { useEffect, useRef, useState } from 'react';

import { Box, Container, Flex, useDisclosure, VStack } from '@chakra-ui/react';

import { SettingsBar } from '@/components/SettingsBar';
import { CompletionModal } from '@/components/modals/CompletionModal';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';
import { SudokuBoard } from '@/components/SudokuGrid/SudokuBoard';
import { useSudokuGame } from '@/hooks/use-sudoku-game';
import {
  CellFill,
  CellPosition,
  GameAction,
  SudokuDigit,
} from '@/components/SudokuGrid/types';
import { ControlsSidebar } from '@/components/ControlsSidebar';

// constants
const CONFIRM_CONFIG = {
  newGame: {
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
    newGame,
    resume,
    restart,
    addCandidate,
    removeCandidate,
  } = actions;

  const confirmationModal = useDisclosure();
  const completionModal = useDisclosure();

  const [confirmationMode, setConfirmationMode] =
    useState<GameAction>('newGame');
  const [selectedPos, setSelectedPos] = useState<CellPosition | null>(null);
  const [fillMode, setFillMode] = useState<CellFill>('digit');

  const selectedCell = selectedPos
    ? state.board[selectedPos.row]?.[selectedPos.col]
    : null;

  const previousCompleted = useRef(state.completed);

  // effects
  useEffect(() => {
    if (!previousCompleted.current && state.completed) completionModal.onOpen();

    previousCompleted.current = state.completed;
  }, [state.completed, completionModal]);

  // modal handlers 
  const handleGameAction = (mode: GameAction) => {
    setConfirmationMode(mode);
    confirmationModal.onOpen();
  };

  const handleConfirm = () => {
    if (confirmationMode === 'newGame') newGame();
    else restart();

    confirmationModal.onClose();
  };

  const handleCompletionReset = () => {
    newGame();
    completionModal.onClose();
  };

  // cell handlers
  const handleCellSelection = (pos: CellPosition) => setSelectedPos(pos);

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
      clearCell(selectedPos);
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

  return (
    <Container
      as={VStack}
      w="full"
      h="full"
      alignItems="center"
      justifyContent="center"
      pt={2}
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
        {/* left sidebar */}
        <Box flex="1" />
        {/* board */}
        <SudokuBoard
          puzzle={state.board}
          isPaused={state.paused}
          clearCell={handleDigitRemoval}
          fillCell={handleDigitInput}
          resume={resume}
          onCellSelect={handleCellSelection}
        />
        {/* right sidebar */}
        <ControlsSidebar
          fillMode={fillMode}
          remaining={state.remaining}
          handleGameAction={handleGameAction}
          handleTabChange={setFillMode}
          handleValueClick={handleValueClick}
        />
      </Flex>
      {/* modals */}
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
