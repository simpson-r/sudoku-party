'use client';

import { SetupConfig } from '@/components/SudokuGrid/types';
import { useSinglePlayerSudoku } from '@/hooks/use-single-player-sudoku';
import { GameView } from './GameView';

/**
 * Manages and renders a single player sudoku game session
 */
export const SinglePlayerGame = ({ config }: { config: SetupConfig }) => {
  const { state, actions } = useSinglePlayerSudoku(config.difficulty);
  const players = [{ score: state.score, name: 'you', id: '1' }];

  return (
    <GameView
      autoCandidates={state.autoCandidates}
      board={state.board}
      difficulty={config.difficulty}
      errors={state.errors}
      isGameComplete={state.completed}
      isPaused={state.paused}
      players={players}
      totalPausedMs={state.totalPausedMs}
      pausedAt={state.pausedAt}
      startedAt={state.startedAt}
      completedAt={state.completedAt}
      remainingCounts={state.remaining}
      toggleAutoCandidates={actions.toggleAutoCandidates}
      onFillCell={actions.fillCell}
      onClearCell={actions.clearCell}
      onAddCandidate={actions.addCandidate}
      onRemoveCandidate={actions.removeCandidate}
      onNewGame={actions.newGame}
      onPause={actions.pause}
      onResume={actions.resume}
    />
  );
};
