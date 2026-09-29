import { useEffect, useMemo, useReducer, useState } from 'react';

import { CellPayload } from '@/components/SudokuGrid/types';
import { ONE_SEC } from '@/components/SudokuGrid/constants';
import {
  generateSudokuGame,
  isPuzzleComplete,
} from '../../../shared/sudoku-generator';
import { buildRemainingCounts, formatSeconds } from '@/utils/helpers';
import {
  Cell,
  CellPosition,
  Difficulty,
  RemainingCounts,
  SudokuDigit,
} from '@shared/types';
import { updateBoard } from '@shared/helpers';

// types & interfaces
interface SudokuState {
  board: Cell[][];
  errors: number;
  completed: boolean;
  paused: boolean;
  remaining: RemainingCounts;
}
type CandidateRemoval = { row: number; col: number; candidates: SudokuDigit[] };
type ResetPayload = { board: Cell[][]; remaining: RemainingCounts };

type Action =
  | { type: 'CLEAR_DIGIT'; payload: CellPosition }
  | { type: 'FILL_DIGIT'; payload: CellPayload }
  | { type: 'ADD_CANDIDATE'; payload: CellPayload }
  | { type: 'REMOVE_CANDIDATE'; payload: CandidateRemoval }
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
});

// reducer
export function reducer(state: SudokuState, action: Action): SudokuState {
  switch (action.type) {
    case 'FILL_DIGIT': {
      const { row, col, value } = action.payload;
      const prevCell = state.board[row][col];
      const { board, cell } = updateBoard(state.board, row, col, { value });

      const remaining = {
        ...state.remaining,
        [value]: state.remaining[value] - (prevCell.value !== value ? 1 : 0),
        ...(prevCell.value &&
          prevCell.value !== cell.value && {
            [prevCell.value]: state.remaining[prevCell.value] + 1,
          }),
      };

      return {
        ...state,
        board,
        errors: state.errors + (value !== cell.actual ? 1 : 0),
        remaining,
        completed: isPuzzleComplete(board),
      };
    }
    case 'CLEAR_DIGIT': {
      const { row, col } = action.payload;
      const prevCell = state.board[row][col];
      if (!prevCell.value) return state;

      const { board } = updateBoard(state.board, row, col, { value: null });

      return {
        ...state,
        board,
        remaining: {
          ...state.remaining,
          [prevCell.value]: state.remaining[prevCell.value] + 1,
        },
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
  const [timer, setTimer] = useState(0);

  // effects
  useEffect(() => {
    // timer
    if (state.paused || state.completed) return;

    const intervalId = window.setInterval(() => {
      setTimer((time) => time + 1);
    }, ONE_SEC);

    return () => clearInterval(intervalId);
  }, [state.paused, state.completed]);

  // actions
  const clearCell = (payload: CellPosition) =>
    dispatch({ type: 'CLEAR_DIGIT', payload });

  const fillCell = (payload: CellPayload) =>
    dispatch({ type: 'FILL_DIGIT', payload });

  const addCandidate = (payload: CellPayload) =>
    dispatch({ type: 'ADD_CANDIDATE', payload });

  const removeCandidate = (payload: CandidateRemoval) =>
    dispatch({ type: 'REMOVE_CANDIDATE', payload });

  const pause = () => dispatch({ type: 'PAUSE' });

  const resume = () => dispatch({ type: 'RESUME' });

  const newGame = () => {
    const newPuzzle = generateSudokuGame();
    const newRemaining = buildRemainingCounts(newPuzzle);

    setInitialBoard(newPuzzle);

    const payload = { board: newPuzzle, remaining: newRemaining };
    dispatch({ type: 'RESET', payload });
    setTimer(0);
  };

  const restart = () => {
    const payload = { board: initialBoard, remaining: initialRemaining };
    dispatch({ type: 'RESET', payload });
    setTimer(0);
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
    time: formatSeconds(timer),
    state,
  };
};
