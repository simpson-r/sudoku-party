'use client';

import { useState } from 'react';

import { useSinglePlayerSudoku } from '@/hooks/use-single-player-sudoku';
import { CellFill } from '@/components/SudokuGrid/types';
import { CellPosition, SudokuDigit } from '@shared/types';
import { GameView } from './GameView';

export const MultiplayerGame = () => {
  const { state, time, actions } = useSinglePlayerSudoku();
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

  const [selectedPos, setSelectedPos] = useState<CellPosition | null>(null);
  const [fillMode, setFillMode] = useState<CellFill>('digit');

  const selectedCell = selectedPos
    ? state.board[selectedPos.row]?.[selectedPos.col]
    : null;

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
    <GameView
      board={state.board}
      isGameComplete={state.completed}
      isPaused={state.paused}
      time={time}
      fillMode={fillMode}
      errors={state.errors}
      remainingCounts={state.remaining}
      onDigitInput={handleDigitInput}
      onDigitRemoval={handleDigitRemoval}
      onPause={pause}
      onResume={resume}
      onNewGame={newGame}
      onRestart={restart}
      onTabChange={setFillMode}
      onCellSelect={handleCellSelection}
      onDigitClick={handleValueClick}
    />
  );
};
