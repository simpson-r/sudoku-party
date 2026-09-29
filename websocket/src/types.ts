import { WebSocket } from 'ws';
import type { SudokuDigit, SudokuGame } from '../../shared/types.js';

// player
export type Player = { id: string; name: string; socket: WebSocket };

// room
export type Room = { players: Map<string, Player>; game: SudokuGame };

// messages
export type CellUpdate =
  | { type: 'fill'; row: number; col: number; value: SudokuDigit }
  | { type: 'clear'; row: number; col: number };
