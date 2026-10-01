import { useMemo, useReducer, useState } from 'react';

import { CellPayload } from '@/components/SudokuGrid/types';
import { buildRemainingCounts, updateBoard } from '@sudokuparty/shared/helpers';
import {
  generateSudokuGame,
  isPuzzleComplete,
} from '@sudokuparty/shared/sudoku-generator';
import {
  CandidateUpdate,
  Cell,
  CellPosition,
  Difficulty,
  RemainingCounts,
} from '@sudokuparty/shared/types';

// types & interfaces
interface SudokuState {
  board: Cell[][];
  errors: number;
  completed: boolean;
  paused: boolean;
  remaining: RemainingCounts;
  score: number;
  startedAt: number;
  completedAt: number | null;
}

type ResetPayload = { board: Cell[][]; remaining: RemainingCounts };

type Action =
  | { type: 'CLEAR_DIGIT'; payload: CellPosition }
  | { type: 'FILL_DIGIT'; payload: CellPayload }
  | { type: 'ADD_CANDIDATE'; payload: CellPayload }
  | { type: 'REMOVE_CANDIDATE'; payload: CandidateUpdate }
  | { type: 'PAUSE' }
  | { type: 'RESET'; payload: ResetPayload }
  | { type: 'RESUME' };

// helpers
const createInitialState = (
  board: Cell[][],
  remaining: RemainingCounts,
): SudokuState => ({
  board,
  remaining,
  errors: 0,
  completed: false,
  paused: false,
  score: 0,
  startedAt: Date.now(),
  completedAt: null,
});

// reducer
export function reducer(state: SudokuState, action: Action): SudokuState {
  switch (action.type) {
    case 'FILL_DIGIT': {
      const { row, col, value } = action.payload;

      const prevCell = state.board[row][col];
      if (prevCell.actual === prevCell.value || !state.remaining[value])
        return state;

      const { board, cell } = updateBoard(state.board, row, col, { value });

      return {
        ...state,
        board,
        errors: state.errors + (value !== cell.actual ? 1 : 0),
        remaining: buildRemainingCounts(board),
        completed: isPuzzleComplete(board),
        score: state.score + (cell.value === cell.actual ? 10 : -10),
      };
    }
    case 'CLEAR_DIGIT': {
      const { row, col } = action.payload;
      const prevCell = state.board[row][col];
      if (!prevCell.value || prevCell.value === prevCell.actual) return state;

      const { board } = updateBoard(state.board, row, col, { value: null });

      return {
        ...state,
        board,
        remaining: buildRemainingCounts(board),
      };
    }
    case 'PAUSE':
      return {
        ...state,
        paused: true,
      };
    case 'RESUME':
      return {
        ...state,
        paused: false,
      };
    case 'RESET': {
      const { board, remaining } = action.payload;
      return createInitialState(board, remaining);
    }
    case 'ADD_CANDIDATE': {
      const { row, col, value } = action.payload;
      const prevCell = state.board[row][col];

      const curCandidates = prevCell?.candidates ?? [];
      if (curCandidates.includes(value)) return state;
      const candidates = [...curCandidates, value];

      const { board } = updateBoard(state.board, row, col, { candidates });

      return {
        ...state,
        board,
      };
    }
    case 'REMOVE_CANDIDATE': {
      const { row, col, candidates: toRemove } = action.payload;
      const prevCell = state.board[row][col];
      const curCandidates = prevCell.candidates ?? [];

      const candidates = curCandidates.filter((c) => !toRemove.includes(c));
      const { board } = updateBoard(state.board, row, col, { candidates });

      return {
        ...state,
        board,
      };
    }
    default:
      return state;
  }
}

/**
 * This hook manages single player Sudoku game state, actions, and lifecycle.
 */
export const useSinglePlayerSudoku = (difficulty: Difficulty) => {
  const [initialBoard, setInitialBoard] = useState(() =>
    generateSudokuGame(difficulty),
  );

  const initialRemaining = useMemo(
    () => buildRemainingCounts(initialBoard),
    [initialBoard],
  );
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(initialBoard, initialRemaining),
  );

  // actions
  const clearCell = (payload: CellPosition) =>
    dispatch({ type: 'CLEAR_DIGIT', payload });

  const fillCell = (payload: CellPayload) =>
    dispatch({ type: 'FILL_DIGIT', payload });

  const addCandidate = (payload: CellPayload) =>
    dispatch({ type: 'ADD_CANDIDATE', payload });

  const removeCandidate = (payload: CandidateUpdate) =>
    dispatch({ type: 'REMOVE_CANDIDATE', payload });

  const pause = () => dispatch({ type: 'PAUSE' });

  const resume = () => dispatch({ type: 'RESUME' });

  const newGame = () => {
    const newPuzzle = generateSudokuGame();
    const newRemaining = buildRemainingCounts(newPuzzle);

    setInitialBoard(newPuzzle);

    const payload = { board: newPuzzle, remaining: newRemaining };
    dispatch({ type: 'RESET', payload });
  };

  const restart = () => {
    const payload = { board: initialBoard, remaining: initialRemaining };
    dispatch({ type: 'RESET', payload });
  };

  return {
    actions: {
      fillCell,
      clearCell,
      addCandidate,
      removeCandidate,
      pause,
      resume,
      restart,
      newGame,
    },
    puzzle: initialBoard,
    state,
  };
};
