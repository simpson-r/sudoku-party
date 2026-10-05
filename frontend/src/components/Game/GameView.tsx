'use client';

import { useEffect, useRef, useState } from 'react';

import { Box, Button, Checkbox, useDisclosure } from '@chakra-ui/react';

import { Game } from '@/components/layout/Game';
import { CompletionModal } from '@/components/modals/CompletionModal';
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
import { Scoreboard } from '../Scoreboard';
import { InviteLink } from '../InviteLink';
import { ActivityLog } from '../ActivityLog';
import { ConfirmationModal } from '../modals/ConfirmationModal';

// types
interface GameViewProps {
  autoCandidates?: boolean;
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
  pausedAt: number | null;
  totalPausedMs: number;
  startedAt: number;
  completedAt: number | null;
  toggleAutoCandidates?: VoidFunction;
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
  heading: 'Start a new game?',
  body: 'This will end the current session',
  confirmText: 'New Game',
  cancelText: 'Cancel',
};

/**
 * This component coordinates the sudoku game, including gameplay controls, board interactions, and game lifecycle modals
 */
export const GameView = ({
  activityLog,
  autoCandidates,
  board,
  errors,
  difficulty,
  isGameComplete,
  isPaused,
  playerId,
  players,
  remainingCounts,
  roomId,
  totalPausedMs,
  pausedAt,
  startedAt,
  completedAt,
  onFillCell,
  onAddCandidate,
  onRemoveCandidate,
  onClearCell,
  onNewGame,
  onPause,
  onResume,
  toggleAutoCandidates,
}: GameViewProps) => {
  const completionModal = useDisclosure();
  const confirmationModal = useDisclosure();
  const [selectedPos, setSelectedPos] = useState<CellPosition | null>(null);
  const [fillMode, setFillMode] = useState<CellFill>('digit');
  const previousCompleted = useRef(isGameComplete);

  const isMultiplayer = !!roomId;
  const selectedCell = selectedPos
    ? board?.[selectedPos.row]?.[selectedPos.col]
    : null;

  // effects
  useEffect(() => {
    if (!previousCompleted.current && isGameComplete) completionModal.onOpen();
    if (previousCompleted.current && !isGameComplete) completionModal.onClose();
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
    if (selectedCell?.value === selectedCell?.actual) return; // lock correct values

    const payload = { ...selectedPos, value: digit };
    if (fillMode === 'digit') {
      digit === selectedCell?.value
        ? onClearCell(selectedPos)
        : onFillCell(payload);
      return;
    } else onAddCandidate(payload);
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
          {isMultiplayer && (
            <Box display={{ base: 'block', lg: 'none' }} w="full">
              <InviteLink roomId={roomId} />
            </Box>
          )}

          <Game.Status w="full">
            <SettingsBar
              enablePause={!isMultiplayer}
              errors={errors}
              difficulty={difficulty}
              isPaused={isPaused}
              hidePauseToggle={isMultiplayer}
              totalPausedMs={totalPausedMs}
              pausedAt={pausedAt}
              startedAt={startedAt}
              completedAt={completedAt}
              pause={onPause}
              resume={onResume}
            />
          </Game.Status>
          {/* board */}
          <SudokuBoard
            board={board}
            autoCandidates={autoCandidates}
            isPaused={isPaused}
            clearCell={handleDigitRemoval}
            fillCell={handleDigitInput}
            resume={onResume}
            onCellSelect={handleCellSelection}
          />
        </Game.Main>

        {/* sidebar */}
        <Game.Sidebar>
          {isMultiplayer ? (
            <Box display={{ base: 'none', lg: 'block' }} w="full">
              <InviteLink roomId={roomId} />
            </Box>
          ) : (
            <Game.Status />
          )}
          <Controls
            disabled={isPaused}
            fillMode={fillMode}
            remaining={remainingCounts}
            handleTabChange={setFillMode}
            handleValueClick={handleValueClick}
          />
          {players && (
            <Scoreboard
              players={players}
              playerId={playerId || ''}
              isMultiplayer={isMultiplayer}
            />
          )}
          {!isMultiplayer && (
            <Checkbox.Root
              disabled={isPaused}
              checked={autoCandidates}
              onCheckedChange={() => toggleAutoCandidates?.()}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label textStyle='sm' unstyled>Auto-candidate mode</Checkbox.Label>
            </Checkbox.Root>
          )}

          {isMultiplayer && <ActivityLog activityLog={activityLog} />}
          {!isMultiplayer && (
            <Button variant="surface" onClick={confirmationModal.onOpen}>
              new game
            </Button>
          )}
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
        totalPausedMs={totalPausedMs}
        onClose={completionModal.onClose}
        onNewGame={handleNewGame}
      />
      <ConfirmationModal
        ctaConfig={CONFIRM_CONFIG}
        isOpen={confirmationModal.open}
        onClose={confirmationModal.onClose}
        onConfirm={handleNewGame}
      />
    </Game.Root>
  );
};
