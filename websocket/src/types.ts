import { WebSocket } from 'ws';
import type { SudokuDigit } from '../../shared/types.js';

// player
export type Player = { id: string; name: string; socket: WebSocket };
export type PlayerInfo = { id: string; name: string };

// room
export type Room = { players: Map<string, Player> };

// messages
export type ClientMessage =
  | { type: 'join'; roomId: string; name: string }
  | { type: 'cell_update'; row: number; col: number; value: number | null };

export type ServerMessage =
  | { type: 'notification'; message: string }
  | { type: 'users'; users: string[] }
  | { type: 'cell_updated'; row: number; col: number; value: number | null }
  | { type: 'player_joined'; player: PlayerInfo }
  | { type: 'player_left'; playerId: string };

export type CellUpdate = {
  userId?: string;
  row?: number;
  col?: number;
  value?: SudokuDigit;
};