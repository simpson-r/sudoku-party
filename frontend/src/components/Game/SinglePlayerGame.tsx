'use client';

import { SetupConfig } from '@/components/SudokuGrid/types';
import { useSinglePlayerSudoku } from '@/hooks/use-single-player-sudoku';
import { GameView } from './GameView';

export const SinglePlayerGame = ({ config }: { config: SetupConfig }) => {
  const { state, actions } = useSinglePlayerSudoku(config.difficulty);
  const players = [{ score: state.score, name: 'you', id: '1' }];

  return (
    <GameView
      board={state.board}
      difficulty={config.difficulty}
      errors={state.errors}
      isGameComplete={state.completed}
      isPaused={state.paused}
      players={players}
      startedAt={0}
      completedAt={null}
      remainingCounts={state.remaining}
      onFillCell={actions.fillCell}
      onClearCell={actions.clearCell}
      onAddCandidate={actions.addCandidate}
      onRemoveCandidate={actions.removeCandidate}
      onNewGame={() => {}}
      onPause={actions.pause}
      onResume={actions.resume}
    />
  );
};
