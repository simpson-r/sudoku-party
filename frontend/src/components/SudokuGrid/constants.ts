// grid
export const GRID_SIZE = 9;
export const BOX_SIZE = Math.sqrt(GRID_SIZE);
export const REMOVALS = { easy: 40, medium: 48, hard: 52 };
export const CANDIDATE_POSITION = (xAxis = 2, yAxis = 1) => ({
  1: { top: yAxis, left: xAxis },
  2: { top: yAxis, left: '50%', transform: 'translateX(-50%)' },
  3: { top: yAxis, right: xAxis },
  4: { top: '50%', left: xAxis, transform: 'translateY(-50%)' },
  5: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  6: { top: '50%', right: xAxis, transform: 'translateY(-50%)' },
  7: { bottom: yAxis, left: xAxis },
  8: { bottom: yAxis, left: '50%', transform: 'translateX(-50%)' },
  9: { bottom: yAxis, right: xAxis },
});

// time
export const ONE_SEC = 1000;
