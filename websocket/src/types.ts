import { WebSocket } from 'ws';
import type { SudokuDigit, SudokuGame } from '../../shared/types.js';

// player
export type Player = { id: string; name: string; socket: WebSocket };
export type PlayerInfo = { id: string; name: string };

// room
export type Room = { players: Map<string, Player>; game: SudokuGame };

// messages
export type ClientMessage =
  | { type: 'join'; roomId: string; name: string }
  | { type: 'cell_update'; row: number; col: number; value: number | null };

export type ServerMessage =
  | { type: 'notification'; message: string }
  | { type: 'users'; users: string[] }
  | { type: 'cell_updated'; row: number; col: number; value: number | null }
  | { type: 'game_state'; game: SudokuGame }
  | { type: 'player_joined'; player: PlayerInfo }
  | { type: 'player_left'; playerId: string };

export type CellUpdate =
  | { type: 'fill'; row: number; col: number; value: SudokuDigit }
  | { type: 'clear'; row: number; col: number };
