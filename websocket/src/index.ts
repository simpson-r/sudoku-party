import { randomUUID } from 'node:crypto';
import { WebSocket, WebSocketServer } from 'ws';
import type { Player, Room } from './types.js';
import { generateSudokuGame } from '../../shared/sudoku-generator.js';
import type { ClientMessage, ServerMessage } from '../../shared/types.js';
import { isValidPosition, updateBoard } from '../../shared/helpers.js';

// constants
const PORT = 8080;

// setup
const wss = new WebSocketServer({ port: PORT });
const rooms = new Map<string, Room>();

// helpers
function broadcastToRoom(
  roomId: string,
  data: ServerMessage,
  ignoreSocket?: WebSocket,
) {
  const room = rooms.get(roomId);
  if (!room) return;
  for (const player of room.players.values()) {
    const { socket } = player;
    if (socket.readyState === WebSocket.OPEN && socket !== ignoreSocket) {
      socket.send(JSON.stringify(data));
    }
  }
}

wss.on('connection', (ws) => {
  const playerId = randomUUID();
  let roomId: string | null = null;
  let name: string | null = null;

  // message handling
  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message.toString()) as ClientMessage;

      switch (msg.type) {
        case 'join': {
          roomId = msg.roomId;

          if (!rooms.get(roomId)) {
            rooms.set(roomId, {
              players: new Map<string, Player>(),
              game: { board: generateSudokuGame(), startedAt: Date.now() },
              nextPlayerIndex: 1,
            });
          }

          const room = rooms.get(roomId)!;
          name = `Player ${room.nextPlayerIndex}`;
          room.nextPlayerIndex++;

          const playersMap = rooms.get(roomId)!.players;
          playersMap.set(playerId, { id: playerId, name, socket: ws });

          ws.send(JSON.stringify({ type: 'identity', playerId })); // send identity to user
          ws.send(JSON.stringify({ type: 'game_state', game: room.game })); // send game state to user

          const players = Array.from(playersMap.values()).map(
            ({ name, id }) => ({ name, id }),
          );
          broadcastToRoom(roomId, { type: 'players', players });
          break;
        }
        case 'cell_update': {
          if (!roomId) return;

          const room = rooms.get(roomId);
          if (!room) return;

          const { row, col, value } = msg;
          if (!isValidPosition(row, col)) return;

          const game = room.game;
          const { board } = updateBoard(game.board, row, col, { value });
          game.board = board;

          const outgoing: ServerMessage = {
            type: 'cell_updated',
            row,
            col,
            value,
          };

          broadcastToRoom(roomId, outgoing, ws);
          break;
        }
        case 'candidate_add': {
          if (!roomId) return;

          const room = rooms.get(roomId);
          if (!room) return;

          const { row, col, candidate } = msg;
          if (!isValidPosition(row, col)) return;

          const game = room.game;
          const cell = game.board?.[row]?.[col];

          const candidates = [...(cell?.candidates ?? []), candidate];

          const { board } = updateBoard(room.game.board, row, col, {
            candidates,
          });
          game.board = board;

          const outgoing: ServerMessage = {
            type: 'candidates_updated',
            row,
            col,
            candidates,
          };

          broadcastToRoom(roomId, outgoing, ws);
          break;
        }

        case 'candidate_remove': {
          if (!roomId) return;

          const room = rooms.get(roomId);
          if (!room) return;

          const { row, col, candidates } = msg;
          const game = room.game;
          const cell = game.board?.[row]?.[col];

          const updatedCandidates = (cell?.candidates ?? []).filter(
            (c) => !candidates.includes(c),
          );

          const { board } = updateBoard(room.game.board, row, col, {
            candidates: updatedCandidates,
          });
          game.board = board;

          const outgoing: ServerMessage = {
            type: 'candidates_updated',
            row,
            col,
            candidates: updatedCandidates,
          };

          broadcastToRoom(roomId, outgoing, ws);
          break;
        }
      }
    } catch (err) {
      console.error('Failed to handle message:', err);
    }
  });

  // close handling
  ws.on('close', () => {
    if (roomId && rooms.get(roomId)) {
      const playersMap = rooms.get(roomId)?.players;
      playersMap?.delete(playerId);

      const players = Array.from(playersMap?.values() ?? []).map(
        ({ name, id }) => ({ name, id }),
      );
      // send to room: updated users list
      broadcastToRoom(roomId, { type: 'players', players });
      // room cleanup
      if (playersMap?.size === 0) rooms.delete(roomId);
    }
  });
});

console.log(`WebSocket server listening on port ${PORT}`);
