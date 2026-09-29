import { DIFFICULTY_MAP } from './constants';

export const parseDifficulty = (roomId: string) =>
  DIFFICULTY_MAP[roomId[0] as keyof typeof DIFFICULTY_MAP];
