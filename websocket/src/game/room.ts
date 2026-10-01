import { WebSocket } from 'ws';

import { generateSudokuGame } from '../../../shared/sudoku-generator.js';
import type { Difficulty, ServerMessage } from '../../../shared/types.js';
import type { Player, Room } from '../types.js';

// constants
export const ROOM_ID_REGEX = /^[emh][a-zA-Z0-9]{6}$/;

/**
 * Determines if roomId satisfies regular expression rule
 */
export const isValidRoomId = (roomId: string) => ROOM_ID_REGEX.test(roomId);

/**
 * Returns an existing room or creates a new room with an initialized game.
 */
export const createOrGetRoom = (
  rooms: Map<string, Room>,
  roomId: string,
  difficulty: Difficulty
) => {
  const existingRoom = rooms.get(roomId);
  if (existingRoom) return existingRoom;

  const room: Room = {
    players: new Map(),
    game: { board: generateSudokuGame(difficulty), startedAt: Date.now() },
    nextPlayerIndex: 1,
  };
  rooms.set(roomId, room);

  return room;
};

/**
 * Broadcasts a message to all connected players in a room, optionally excluding one socket
 */
export function broadcastToRoom(
  room: Room | undefined,
  data: ServerMessage,
  ignoreSocket?: WebSocket,
) {
  if (!room) return;
  for (const player of room.players.values()) {
    const { socket } = player;
    if (socket.readyState === WebSocket.OPEN && socket !== ignoreSocket) {
      socket.send(JSON.stringify(data));
    }
  }
}
