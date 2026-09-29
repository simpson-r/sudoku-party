import { INITIAL_REMAINING } from '@/components/SudokuGrid/constants';
import { Cell } from '@shared/types';

/**
 * Formats a duration in seconds as MM:SS or HH:MM:SS.
 */
export const formatSeconds = (secs: number) => {
  const pad = (num: number) => (num < 10 ? `0${num}` : num);

  const h = Math.floor(secs / 3600);
  const m = Math.floor(secs / 60) - h * 60;
  const s = Math.floor(secs - h * 3600 - m * 60);

  return `${h > 0 ? `${pad(h)}:` : ''}${pad(m)}:${pad(s)}`;
};

/**
 * Returns the elapsed time in seconds since the game started
 */
export const getElapsedTime = (startedAt: number) =>
  Math.floor((Date.now() - startedAt) / 1000);

export const buildRemainingCounts = (puzzle: Cell[][]) => {
  const remaining = { ...INITIAL_REMAINING };
  for (const row of puzzle) {
    for (const { actual, given } of row) {
      if (given) remaining[actual]--;
    }
  }

  return remaining;
};
