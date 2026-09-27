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
 * Returns a randomly shuffled copy of an array without mutating the original (Fisher–Yates)
 */
export const shuffle = <T>(values: T[]): T[] => {
  const result = [...values];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};