export const formatSeconds = (secs: number) => {
  const pad = (num: number) => (num < 10 ? `0${num}` : num);

  const h = Math.floor(secs / 3600);
  const m = Math.floor(secs / 60) - h * 60;
  const s = Math.floor(secs - h * 3600 - m * 60);

  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};
