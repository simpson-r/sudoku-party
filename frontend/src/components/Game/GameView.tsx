'use client';

import { useEffect, useRef, useState } from 'react';

import { Box, useDisclosure } from '@chakra-ui/react';

import { Game } from '@/components/layout/GameLayout';
import { CompletionModal } from '@/components/modals/CompletionModal';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';
import { SettingsBar } from '@/components/SettingsBar';
import { SudokuBoard } from '@/components/SudokuGrid/SudokuBoard';
import { CellFill, GameAction } from '@/components/SudokuGrid/types';
import { ControlsSidebar } from '@/components/ControlsSidebar';
import {
  Cell,
  CellPosition,
  RemainingCounts,
  SudokuDigit,
} from '@shared/types';

// types
interface GameViewProps {
  board: Cell[][];
  errors: number;
  fillMode: CellFill;
  isGameComplete: boolean;
  isPaused: boolean;
  remainingCounts: RemainingCounts;
  time: string;
  onCellSelect: (pos: CellPosition) => void;
  onDigitClick: (digit: SudokuDigit) => void;
  onDigitInput: (digit: SudokuDigit) => void;
  onDigitRemoval: (digit: SudokuDigit | null) => void;
  onNewGame: VoidFunction;
  onPause: VoidFunction;
  onRestart: VoidFunction;
  onResume: VoidFunction;
  onTabChange: (fill: CellFill) => void;
}
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
export const GameView = ({
  board,
  errors,
  fillMode,
  isGameComplete,
  isPaused,
  remainingCounts,
  time,
  onCellSelect,
  onDigitClick,
  onDigitInput,
  onDigitRemoval,
  onNewGame,
  onPause,
  onRestart,
  onResume,
  onTabChange,
}: GameViewProps) => {
  const confirmationModal = useDisclosure();
  const completionModal = useDisclosure();
  const [confirmationMode, setConfirmationMode] =
    useState<GameAction>('newGame');
  const previousCompleted = useRef(isGameComplete);

  // effects
  useEffect(() => {
    if (!previousCompleted.current && isGameComplete) completionModal.onOpen();

    previousCompleted.current = isGameComplete;
  }, [isGameComplete, completionModal]);

  // modal handlers
  const handleGameAction = (mode: GameAction) => {
    setConfirmationMode(mode);
    confirmationModal.onOpen();
  };

  const handleConfirm = () => {
    if (confirmationMode === 'newGame') onNewGame();
    else onRestart();

    confirmationModal.onClose();
  };

  const handleCompletionReset = () => {
    onNewGame();
    completionModal.onClose();
  };

  return (
    <Game.Root>
      <Game.Status>
        <SettingsBar
          errors={errors}
          isPaused={isPaused}
          hidePauseToggle={isGameComplete}
          time={time}
          pause={onPause}
          resume={onResume}
        />
      </Game.Status>

      <Game.Content>
        {/* left sidebar */}
        <Game.Side />
        {/* board */}
        <SudokuBoard
          puzzle={board}
          isPaused={isPaused}
          clearCell={onDigitRemoval}
          fillCell={onDigitInput}
          resume={onResume}
          onCellSelect={onCellSelect}
        />
        {/* right sidebar */}
        <Game.Side>
          <ControlsSidebar
            fillMode={fillMode}
            remaining={remainingCounts}
            handleGameAction={handleGameAction}
            handleTabChange={onTabChange}
            handleValueClick={onDigitClick}
          />
        </Game.Side>
      </Game.Content>
      {/* modals */}
      <CompletionModal
        difficulty="easy"
        errors={errors}
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
    </Game.Root>
  );
};
