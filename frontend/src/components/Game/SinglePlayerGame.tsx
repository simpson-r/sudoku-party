'use client';

import {  SetupConfig } from '@/components/SudokuGrid/types';
import { useSinglePlayerSudoku } from '@/hooks/use-single-player-sudoku';
import { GameView } from './GameView';

export const SinglePlayerGame = ({ config }: { config: SetupConfig }) => {
  const { state, time, actions } = useSinglePlayerSudoku(config.difficulty);

  return (
    <GameView
      board={state.board}
      difficulty={config.difficulty}
      isGameComplete={state.completed}
      isPaused={state.paused}
      time={time}
      errors={state.errors}
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
