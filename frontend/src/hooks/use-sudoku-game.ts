import { useEffect, useReducer, useState } from 'react';

import { Cell, CellPayload, SudokuDigit } from '../components/SudokuGrid/types';
import { GRID_SIZE, ONE_SEC } from '../components/SudokuGrid/constants';
import { generateSudokuGame } from '../modules/game-generator';
import { formatSeconds } from '../utils/helpers';

/** helpers */
const buildRemainingCounts = (puzzle: Cell[][]) => {
  const remaining: Record<number, number> = {};
  for (const row of puzzle) {
    for (const { actual, given } of row) {
      remaining[actual] ??= GRID_SIZE;
      if (given) remaining[actual]--;
    }
  }

  return remaining;
};
/**
 * types & interfaces
 */
export interface SudokuState {
  board: Cell[][];
  errors: number;
  completed: boolean;
  paused: boolean;
  endTime?: Date;
  remaining: Record<number, number>;
}

type CandidateRemoval = {
  row: number;
  col: number;
  candidates: SudokuDigit[];
};
type ResetPayload = {
  board: Cell[][];
  remaining: Record<number, number>;
};

type Action =
  | { type: 'FILL_DIGIT'; payload: CellPayload }
  | { type: 'CLEAR_DIGIT'; payload: CellPayload }
  | { type: 'ADD_CANDIDATE'; payload: CellPayload }
  | { type: 'REMOVE_CANDIDATE'; payload: CandidateRemoval }
  | { type: 'PAUSE' }
  | { type: 'RESET'; payload: ResetPayload }
  | { type: 'RESTART'; payload: ResetPayload }
  | { type: 'RESUME' }
  | { type: 'COMPLETE'; payload: { endTime: Date } };

const defaultState: SudokuState = {
  board: [[]],
  errors: 0,
  completed: false,
  paused: false,
  endTime: undefined,
  remaining: {},
};

const updateBoard = (
  curBoard: Cell[][],
  row: number,
  col: number,
  value: Partial<Cell>,
) => {
  const cell: Cell = {
    ...curBoard[row][col],
    ...value,
  };
  const updatedRow = curBoard[row].with(col, cell);
  const board = curBoard.with(row, updatedRow);
  return { board, cell };
};

/**
 * reducer
 */
export function reducer(state: SudokuState, action: Action): SudokuState {
  switch (action.type) {
    case 'FILL_DIGIT': {
      const { row, col, value } = action.payload;
      const prevCell = state.board[row][col];
      
      const { board, cell } = updateBoard(state.board, row, col, { value });

      return {
        ...state,
        board: board,
        errors: state.errors + (value !== cell.actual ? 1 : 0),
        remaining: {
          ...state.remaining,
          [value]: state.remaining[value] - (prevCell.value !== value ? 1 : 0),
          ...(prevCell.value &&
            prevCell.value !== cell.value && {
              [prevCell.value]: state.remaining[prevCell.value] + 1,
            }),
        },
      };
    }
    case 'CLEAR_DIGIT': {
      const { row, col, value } = action.payload;
      const { board } = updateBoard(state.board, row, col, {
        value: null,
      });

      return {
        ...state,
        board,
        remaining: {
          ...state.remaining,
          [value]: state.remaining[value] + 1,
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
      return {
        ...defaultState,
        board,
        remaining,
      };
    }
    case 'ADD_CANDIDATE': {
      const { row, col, value } = action.payload;

      const currCandidates = state.board[row][col]?.candidates ?? [];
      if (currCandidates.includes(value)) return state;

      const candidates = [...currCandidates, value];
      const { board } = updateBoard(state.board, row, col, {
        candidates,
      });

      return {
        ...state,
        board,
      };
    }
    case 'REMOVE_CANDIDATE': {
      const { row, col, candidates: candidatesToRemove } = action.payload;

      const candidates = (state.board[row][col].candidates ?? []).filter(
        (candidate) => !candidatesToRemove.includes(candidate),
      );

      const { board } = updateBoard(state.board, row, col, {
        candidates,
      });

      return {
        ...state,
        board,
      };
    }
    case 'COMPLETE':
      const { endTime } = action.payload;
      return {
        ...state,
        completed: true,
        endTime,
      };
    default:
      return state;
  }
}

/**
 * This hook manages Sudoku game state, gameplay actions, and game lifecycle.
 */
export const useSudokuGame = () => {
  const [puzzle, setPuzzle] = useState(() => generateSudokuGame().puzzle);
  const initialRemaining = buildRemainingCounts(puzzle);
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    remaining: initialRemaining,
    board: puzzle,
  });
  const [timer, setTimer] = useState(0);

  /** EFFECTS */
  // sudoku completion
  useEffect(() => {
    const complete = Object.keys(state.remaining).every(
      (val) => state.remaining[Number(val)] === 0,
    );

    if (complete && !state.completed)
      dispatch({ type: 'COMPLETE', payload: { endTime: new Date() } });
  }, [state.completed, state.remaining]);

  // initialize timer
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (!state.paused && !state.completed) setTimer((s) => s + 1);
    }, ONE_SEC);

    return () => clearInterval(intervalId);
  }, [state.paused, state.completed]);

  /** ACTIONS */
  const clearCell = (payload: CellPayload) =>
    dispatch({ type: 'CLEAR_DIGIT', payload });

  const fillCell = (payload: CellPayload) =>
    dispatch({ type: 'FILL_DIGIT', payload });

  const addCandidate = (payload: CellPayload) =>
    dispatch({ type: 'ADD_CANDIDATE', payload });

  const removeCandidate = (payload: CandidateRemoval) => {
    console.log({ payload }, 'REMOVINGGGG');
    dispatch({ type: 'REMOVE_CANDIDATE', payload });
  };
  const pause = () => dispatch({ type: 'PAUSE' });

  const resume = () => dispatch({ type: 'RESUME' });

  const reset = () => {
    const newPuzzle = generateSudokuGame().puzzle;
    const newRemaining = buildRemainingCounts(newPuzzle);

    setPuzzle(newPuzzle);

    const payload = { board: newPuzzle, remaining: newRemaining };
    dispatch({ type: 'RESET', payload });
    setTimer(0);
  };

  const restart = () => {
    const payload = { board: puzzle, remaining: initialRemaining };
    dispatch({ type: 'RESET', payload });
    setTimer(0);
  };

  return {
    actions: {
      clearCell,
      fillCell,
      pause,
      reset,
      resume,
      restart,
      addCandidate,
      removeCandidate,
    },
    puzzle,
    time: formatSeconds(timer),
    state,
  };
};
