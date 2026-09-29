'use client';

import { useState } from 'react';

import { useMultiplayerSudoku } from '@/hooks/use-multiplayer-sudoku';
import { CellFill, MultiplayerConfig } from '@/components/SudokuGrid/types';
import { CellPosition, SudokuDigit } from '@shared/types';
import { GameLoadingView } from './GameLoadingView';
import { GameView } from './GameView';

export const MultiplayerGame = ({ config }: { config: MultiplayerConfig }) => {
  const [selectedPos, setSelectedPos] = useState<CellPosition | null>(null);
  const [fillMode, setFillMode] = useState<CellFill>('digit');
  const { state, time, actions } = useMultiplayerSudoku(config);

  // render non-interactive board for loading state
  if (!state.board) return <GameLoadingView />;

  // constants
  const { clearCell, fillCell } = actions;
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
      // addCandidate(payload);
    }
  };

  const handleDigitRemoval = (digit: SudokuDigit | null) => {
    if (!selectedCell || !selectedPos) return;

    if (selectedCell.value && digit) {
      clearCell(selectedPos);
      return;
    }

    if (selectedCell.candidates?.length || digit) {
      // removeCandidate({
      //   ...selectedPos,
      //   candidates: digit ? [digit] : (selectedCell.candidates ?? []),
      // });
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
      isGameComplete={false}
      isPaused={false}
      time={time}
      fillMode={fillMode}
      errors={0}
      remainingCounts={state.remaining}
      onDigitInput={handleDigitInput}
      onDigitRemoval={handleDigitRemoval}
      onTabChange={setFillMode}
      onCellSelect={handleCellSelection}
      onDigitClick={handleValueClick}
    />
  );
};
