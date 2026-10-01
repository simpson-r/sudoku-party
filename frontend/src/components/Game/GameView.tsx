'use client';

import { useEffect, useRef, useState } from 'react';

import { useDisclosure } from '@chakra-ui/react';

import { Game } from '@/components/layout/Game';
import { CompletionModal } from '@/components/modals/CompletionModal';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';
import { SettingsBar } from '@/components/SettingsBar';
import { SudokuBoard } from '@/components/SudokuGrid/SudokuBoard';
import { CellFill, CellPayload } from '@/components/SudokuGrid/types';
import { Controls } from '@/components/Controls';
import {
  CandidateUpdate,
  Cell,
  CellPosition,
  CellUpdate,
  Difficulty,
  PlayerInfo,
  RemainingCounts,
  SudokuDigit,
} from '@sudokuparty/shared/types';
import { Players } from '../Players';
import { InviteLink } from '../InviteLink';
import { ActivityLog } from '../ActivityLog';
import { useBreakpoints } from '@/hooks/use-device-breakpoints';

// types
interface GameViewProps {
  activityLog?: string[];
  board?: Cell[][];
  errors?: number;
  difficulty: Difficulty;
  isGameComplete: boolean;
  isPaused: boolean;
  playerId?: string;
  players?: PlayerInfo[];
  remainingCounts: RemainingCounts;
  roomId?: string;
  startedAt: number;
  completedAt: number | null;
  onAddCandidate: (update: CellPayload) => void;
  onRemoveCandidate: (update: CandidateUpdate) => void;
  onFillCell: (update: CellUpdate) => void;
  onClearCell: (pos: CellPosition) => void;
  onNewGame: VoidFunction;
  onPause?: VoidFunction;
  onResume?: VoidFunction;
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
  activityLog,
  board,
  errors,
  difficulty,
  isGameComplete,
  isPaused,
  playerId,
  players,
  remainingCounts,
  roomId,
  startedAt,
  completedAt,
  onFillCell,
  onAddCandidate,
  onRemoveCandidate,
  onClearCell,
  onNewGame,
  onPause,
  onResume,
}: GameViewProps) => {
  const completionModal = useDisclosure();
  const [selectedPos, setSelectedPos] = useState<CellPosition | null>(null);
  const [fillMode, setFillMode] = useState<CellFill>('digit');
  const previousCompleted = useRef(isGameComplete);
  const { isMobile } = useBreakpoints();

  //  const confirmationModal = useDisclosure();
  //const [confirmationMode, setConfirmationMode] =  useState<GameAction>('newGame');

  const isMulti = !!roomId;
  const selectedCell = selectedPos
    ? board?.[selectedPos.row]?.[selectedPos.col]
    : null;

  // effects
  useEffect(() => {
    if (!previousCompleted.current && isGameComplete) completionModal.onOpen();

    previousCompleted.current = isGameComplete;
  }, [isGameComplete, completionModal]);

  // handlers
  const handleNewGame = () => {
    completionModal.onClose();
    onNewGame();
  };

  const handleCellSelection = (pos: CellPosition) => setSelectedPos(pos);

  const handleDigitInput = (digit: SudokuDigit) => {
    if (!selectedPos) return;

    const payload = { ...selectedPos, value: digit };
    if (fillMode === 'digit') onFillCell(payload);
    else onAddCandidate(payload);
  };

  const handleDigitRemoval = (digit: SudokuDigit | null) => {
    if (!selectedCell || !selectedPos) return;

    if (selectedCell.value === selectedCell.actual) return;

    if (selectedCell.value && digit) {
      onClearCell(selectedPos);
      return;
    }

    if (selectedCell.candidates?.length || digit) {
      onRemoveCandidate({
        ...selectedPos,
        candidates: digit ? [digit] : (selectedCell.candidates ?? []),
      });
    }
  };

  const handleValueClick = (digit: SudokuDigit) => {
    if (!selectedCell || selectedCell.value === selectedCell.actual) return;

    const digitMatch = fillMode === 'digit' && selectedCell.value === digit;
    const candidateMatch =
      fillMode === 'candidate' && selectedCell.candidates?.includes(digit);

    digitMatch || candidateMatch
      ? handleDigitRemoval(digit)
      : handleDigitInput(digit);
  };

  return (
    <Game.Root>
      <Game.Content>
        {/* main */}
        <Game.Main>
          {isMobile && isMulti && <InviteLink roomId={roomId} />}
          <Game.Status w="full">
            <SettingsBar
              enablePause={!players}
              errors={errors}
              difficulty={difficulty}
              isPaused={isPaused}
              hidePauseToggle={isMulti}
              startedAt={startedAt}
              completedAt={completedAt}
              pause={onPause}
              resume={onResume}
            />
          </Game.Status>
          {/* board */}
          <SudokuBoard
            puzzle={board}
            isPaused={isPaused}
            clearCell={handleDigitRemoval}
            fillCell={handleDigitInput}
            resume={onResume}
            onCellSelect={handleCellSelection}
          />
        </Game.Main>

        {/* sidebar */}
        <Game.Sidebar>
          {!isMobile &&
            (isMulti ? <InviteLink roomId={roomId} /> : <Game.Status />)}
          <Controls
            fillMode={fillMode}
            remaining={remainingCounts}
            handleTabChange={setFillMode}
            handleValueClick={handleValueClick}
          />
          {players && <Players players={players} playerId={playerId || ''} />}
          {isMulti && <ActivityLog activityLog={activityLog} />}
        </Game.Sidebar>
      </Game.Content>
      {/* modals*/}
      <CompletionModal
        difficulty={difficulty}
        errors={errors}
        isOpen={completionModal.open}
        playerId={playerId}
        players={players}
        startedAt={startedAt}
        completedAt={completedAt}
        onClose={completionModal.onClose}
        onNewGame={handleNewGame}
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
