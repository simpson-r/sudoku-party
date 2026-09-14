import { useEffect, useReducer, useState } from 'react';

import { Cell } from '@/components/SudokuGrid/types';
import { GRID_SIZE, ONE_SEC } from '@/components/SudokuGrid/constants';
import { generateCells, generateSudokuGame } from '@/modules/game-generator';
import { formatSeconds } from '@/utils/helpers';

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
  errors: number;
  completed: boolean;
  paused: boolean;
  endTime?: Date;
  remainingCounts: Record<number, number>;
}

type Action =
  | { type: 'FILL'; payload: number }
  | { type: 'CLEAR'; payload: number }
  | { type: 'RESET' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'COMPLETE' };

const defaultState: SudokuState = {
  errors: 0,
  completed: false,
  paused: false,
  endTime: undefined,
  remainingCounts: {},
};

/**
 * reducer
 */
export function reducer(state: SudokuState, action: Action): SudokuState {
  switch (action.type) {
    case 'FILL': {
      const val = action.payload;
      return {
        ...state,
        remainingCounts: {
          ...state.remainingCounts,
          [val]: state.remainingCounts[val] - 1,
        },
      };
    }
    case 'CLEAR': {
      const val = action.payload;
      return {
        ...state,
        remainingCounts: {
          ...state.remainingCounts,
          [val]: state.remainingCounts[val] + 1,
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
    case 'RESET':
      return {
        ...defaultState,
      };
    case 'COMPLETE':
      return {
        ...state,
        completed: true,
        endTime: new Date(),
      };
    default:
      return state;
  }
}

/**
 * This hook manages Sudoku game state, gameplay actions, and game lifecycle.
 */
export const useSudokuGame = () => {
  const [{ puzzle }] = useState(() => generateSudokuGame());
  const cellsPerBox = generateCells(puzzle);
  const remainingCounts = buildRemainingCounts(puzzle);

  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    remainingCounts,
  });
  
  const [timer, setTimer] = useState(0);

  /** effects */

  // sudoku completion
  useEffect(() => {
    const complete = Object.keys(state.remainingCounts).every(
      (val) => state.remainingCounts[Number(val)] === 0,
    );

    if (complete && !state.completed) dispatch({ type: 'COMPLETE' });
  }, [state.completed, state.remainingCounts]);

  // initialize timer
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (!state.paused) setTimer((s) => s + 1);
    }, ONE_SEC);

    return () => clearInterval(intervalId);
  }, [state.paused]);

  /** actions */
  const clearCell = (payload: number) => dispatch({ type: 'CLEAR', payload });
  const fillCell = (payload: number) => dispatch({ type: 'FILL', payload });
  const pause = () => dispatch({ type: 'PAUSE' });
  const resume = () => dispatch({ type: 'RESUME' });

  return {
    puzzle,
    cellsPerBox,
    time: formatSeconds(timer),
    state,
    fillCell,
    clearCell,
    pause,
    resume,
  };
};
