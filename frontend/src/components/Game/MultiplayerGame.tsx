'use client';

import { useMultiplayerSudoku } from '@/hooks/use-multiplayer-sudoku';
import { MultiplayerConfig } from '@/components/SudokuGrid/types';
import { GameLoadingView } from './GameLoadingView';
import { GameView } from './GameView';

export const MultiplayerGame = ({ config }: { config: MultiplayerConfig }) => {
  const { actions, playerId, state } = useMultiplayerSudoku(config);

  // render non-interactive board for loading state
  if (!state.board) return <GameLoadingView difficulty={config.difficulty} />;

  return (
    <GameView
      activityLog={state.log}
      board={state.board}
      errors={undefined}
      difficulty={config.difficulty}
      isGameComplete={state.completed}
      isPaused={false}
      players={state.players}
      playerId={playerId}
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
