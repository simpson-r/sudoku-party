import type {
  Cell,
  ClientMessage,
  ServerMessage,
  SudokuDigit,
} from '../../../shared/types.js';
import type { Player, Room } from '../types.js';

/**
 * Updates a player's score based on whether their cell value is correct.
 */
export const applyScoreUpdate = (
  value: SudokuDigit | null,
  cell: Cell,
  player: Player,
) => {
  if (value) {
    const isCorrect = value === cell.actual;
    player.score += isCorrect ? 10 : -10;
  }
};

/**
 * Returns whether a row or column index is within the Sudoku grid
 */
export const isValidPosition = (row: number, col: number) =>
  Number.isInteger(row) &&
  Number.isInteger(col) &&
  row >= 0 &&
  row < 9 &&
  col >= 0 &&
  col < 9;

export const getPlayer = (playerId: string, room: Room) => {
  const player = room.players.get(playerId);
  if (!player) return;
  return player;
};

export const getCell = (board: Cell[][], pos: { row: number; col: number }) =>
  board[pos.row]?.[pos.col];
