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
export const getGameElapsedTime = (
  startedAt: number,
  totalPausedMs: number,
  completedAt = Date.now(),
) => Math.floor((completedAt - startedAt - totalPausedMs) / 1000);
