'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useDisclosure } from '@chakra-ui/react';

import { useMultiplayerSudoku } from '@/hooks/use-multiplayer-sudoku';
import { MultiplayerConfig } from '@/components/SudokuGrid/types';
import { GameLoadingView } from './GameLoadingView';
import { GameView } from './GameView';
import { ConfirmationModal } from '../modals/ConfirmationModal';

export const MultiplayerGame = ({ config }: { config: MultiplayerConfig }) => {
  const router = useRouter();
  const { actions, state } = useMultiplayerSudoku(config);
  const roomCapacityModal = useDisclosure();

  useEffect(() => {
    if (state.error === 'ROOM_FULL') roomCapacityModal.onOpen();
  }, [state.error]);

  const handleRoomFull = () => {
    roomCapacityModal.onClose();
    router.push('/');
  };

  // render non-interactive board for loading state
  if (!state.board)
    return (
      <>
        <GameLoadingView difficulty={config.difficulty} />
        <ConfirmationModal
          ctaConfig={{
            heading: 'Game is at capacity',
            body: 'This game already has the maximum of 3 players.',
            confirmText: 'Go back',
          }}
          isOpen={roomCapacityModal.open}
          onClose={handleRoomFull}
          onConfirm={handleRoomFull}
        />
      </>
    );

  return (
    <GameView
      activityLog={state.log}
      board={state.board}
      errors={undefined}
      difficulty={config.difficulty}
      isGameComplete={state.completed}
      isPaused={false}
      players={state.players}
      playerId={state.playerId}
      totalPausedMs={0}
      pausedAt={null}
      remainingCounts={state.remaining}
      roomId={config.roomId}
      startedAt={state.startedAt}
      completedAt={state.completedAt}
      onFillCell={actions.fillCell}
      onClearCell={actions.clearCell}
      onAddCandidate={actions.addCandidate}
      onRemoveCandidate={actions.removeCandidate}
      onNewGame={actions.newGame}
    />
  );
};
