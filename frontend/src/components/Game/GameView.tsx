'use client';

import { useEffect, useRef } from 'react';

import { useBreakpointValue, useDisclosure } from '@chakra-ui/react';

import { Game } from '@/components/layout/Game';
import { CompletionModal } from '@/components/modals/CompletionModal';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';
import { SettingsBar } from '@/components/SettingsBar';
import { SudokuBoard } from '@/components/SudokuGrid/SudokuBoard';
import { CellFill } from '@/components/SudokuGrid/types';
import { Controls } from '@/components/Controls';
import {
  Cell,
  CellPosition,
  Difficulty,
  PlayerInfo,
  RemainingCounts,
  SudokuDigit,
} from '@shared/types';
import { Players } from '../Players';
import { InviteLink } from '../InviteLink';

// types
interface GameViewProps {
  board?: Cell[][];
  errors: number;
  difficulty: Difficulty;
  fillMode: CellFill;
  isGameComplete: boolean;
  isPaused: boolean;
  playerId?: string;
  players?: PlayerInfo[];
  remainingCounts: RemainingCounts;
  roomId?: string;
  time: string;
  onCellSelect: (pos: CellPosition) => void;
  onDigitClick: (digit: SudokuDigit) => void;
  onDigitInput: (digit: SudokuDigit) => void;
  onDigitRemoval: (digit: SudokuDigit | null) => void;
  onNewGame: VoidFunction;
  onPause?: VoidFunction;
  onResume?: VoidFunction;
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
  difficulty,
  isGameComplete,
  isPaused,
  playerId,
  players,
  remainingCounts,
  roomId,
  time,
  onCellSelect,
  onDigitClick,
  onDigitInput,
  onDigitRemoval,
  onNewGame,
  onPause,
  onResume,
  onTabChange,
}: GameViewProps) => {
  const completionModal = useDisclosure();
  //  const confirmationModal = useDisclosure();
  //const [confirmationMode, setConfirmationMode] =  useState<GameAction>('newGame');
  const previousCompleted = useRef(isGameComplete);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isMulti = !!roomId;

  // effects
  useEffect(() => {
    if (!previousCompleted.current && isGameComplete) completionModal.onOpen();

    previousCompleted.current = isGameComplete;
  }, [isGameComplete, completionModal]);

  // handlers
  const handleCompletion = () => {
    completionModal.onClose();
    onNewGame();
  };

  return (
    <Game.Root>
      <Game.Content>
        {/* main */}
        <Game.Main>
          <Game.Status w="full">
            <SettingsBar
              enablePause={!players}
              errors={errors}
              difficulty={difficulty}
              isPaused={isPaused}
              hidePauseToggle={isGameComplete}
              time={time}
              pause={onPause}
              resume={onResume}
            />
          </Game.Status>
          {/* board */}
          <SudokuBoard
            puzzle={board}
            isPaused={isPaused}
            clearCell={onDigitRemoval}
            fillCell={onDigitInput}
            resume={onResume}
            onCellSelect={onCellSelect}
          />
        </Game.Main>

        {/* sidebar */}
        <Game.Sidebar>
          {!isMobile && (
            <Game.Status>
              {isMulti && <InviteLink roomId={roomId} />}
            </Game.Status>
          )}
          <Controls
            fillMode={fillMode}
            remaining={remainingCounts}
            handleTabChange={onTabChange}
            handleValueClick={onDigitClick}
          />
          {players && <Players players={players} playerId={playerId || ''} />}
        </Game.Sidebar>
      </Game.Content>
      {/* modals*/}
      <CompletionModal
        difficulty={difficulty}
        errors={errors}
        isOpen={completionModal.open}
        time={time}
        onClose={completionModal.onClose}
        onNewGame={handleCompletion}
      />
      {/* <ConfirmationModal
        ctaConfig={CONFIRM_CONFIG[confirmationMode]}
        isOpen={confirmationModal.open}
        onClose={confirmationModal.onClose}
        onConfirm={handleConfirm}
      /> */}
    </Game.Root>
  );
};
