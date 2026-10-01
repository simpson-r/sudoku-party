import { randomUUID } from 'node:crypto';
import { WebSocketServer } from 'ws';

import { parseDifficulty, updateBoard } from '../../shared/helpers.js';
import type { ClientMessage, Difficulty } from '../../shared/types.js';
import { broadcastToRoom, createOrGetRoom } from './game/room.js';
import {
  applyScoreUpdate,
  getCell,
  getPlayer,
  isValidPosition,
} from './game/sudoku-game.js';
import type { Room } from './types.js';
import {
  generateSudokuGame,
  isPuzzleComplete,
} from '../../shared/sudoku-generator.js';

// constants
const PORT = 8080;
const MAX_PLAYERS = 3;

// setup
const wss = new WebSocketServer({ port: PORT });
const rooms = new Map<string, Room>();

wss.on('connection', (ws) => {
  const playerId = randomUUID();
  let roomId: string | null = null;
  let name: string | null = null;
  let difficulty: Difficulty | null = null;

  // message handling
  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message.toString()) as ClientMessage;

      switch (msg.type) {
        case 'join': {
          roomId = msg.roomId;
          difficulty = parseDifficulty(roomId);

          const room = createOrGetRoom(rooms, roomId, difficulty);

          if (room.players.size >= MAX_PLAYERS) {
            ws.send(JSON.stringify({ type: 'error', code: 'ROOM_FULL' })); // send room to user
            return;
          }

          ws.send(JSON.stringify({ type: 'identity', playerId })); // send identity to user

          name = `Player ${room.nextPlayerIndex}`;
          room.nextPlayerIndex++;
          room.players.set(playerId, {
            id: playerId,
            name,
            socket: ws,
            score: 0,
          });

          const players = Array.from(room.players.values()).map(
            ({ name, id, score }) => ({ name, id, score }),
          );

          ws.send(
            JSON.stringify({ type: 'game_state', game: room.game, players }),
          ); // send game state to user

          break;
        }
        case 'cell_update': {
          if (!roomId) return;

          const room = rooms.get(roomId);
          if (!room) return;

          const { row, col, value } = msg;
          if (!isValidPosition(row, col)) return; // return if invalid pos

          const cell = getCell(room.game.board, msg);
          if (!cell || cell.value === cell.actual) return; // return if correct to communicate locked-in value

          const player = getPlayer(playerId, room);
          if (!player) return; // return if player not found

          applyScoreUpdate(value, cell, player);

          const { board } = updateBoard(room.game.board, row, col, { value });
          room.game.board = board;

          const players = Array.from(room.players.values()).map(
            ({ name, id, score }) => ({ name, id, score }),
          );

          broadcastToRoom(room, { type: 'players', players }); // send player list with updated scores
          broadcastToRoom(room, {
            type: 'cell_updated',
            row,
            col,
            value,
            player,
          }); // send cell update

          const completed = isPuzzleComplete(room.game.board);
          if (completed)
            broadcastToRoom(room, {
              type: 'game_complete',
              completedAt: Date.now(),
            }); // send completion status to room

          break;
        }
        case 'candidate_add': {
          if (!roomId) return;

          const room = rooms.get(roomId);
          if (!room) return;

          const { row, col, candidate } = msg;
          if (!isValidPosition(row, col)) return; // return if invalid pos

          const cell = getCell(room.game.board, { row, col });
          const candidates = [...(cell?.candidates ?? []), candidate];

          const { board } = updateBoard(room.game.board, row, col, {
            candidates,
          });
          room.game.board = board;

          broadcastToRoom(
            room,
            {
              type: 'candidates_updated',
              row,
              col,
              candidates,
            },
            ws,
          );
          break;
        }

        case 'candidate_remove': {
          if (!roomId) return;

          const room = rooms.get(roomId);
          if (!room) return;

          const { row, col, candidates } = msg;
          const cell = getCell(room.game.board, { row, col });

          const updatedCandidates = (cell?.candidates ?? []).filter(
            (c) => !candidates.includes(c),
          );
          const { board } = updateBoard(room.game.board, row, col, {
            candidates: updatedCandidates,
          });
          room.game.board = board;

          broadcastToRoom(
            room,
            {
              type: 'candidates_updated',
              row,
              col,
              candidates: updatedCandidates,
            },
            ws,
          );
          break;
        }
        case 'new_game': {
          if (!roomId) return;
          const room = rooms.get(roomId);
          if (!room) return;

          room.game = {
            board: generateSudokuGame(difficulty || 'medium'),
            startedAt: Date.now(),
          };

          // reset scores
          for (const player of room.players.values()) {
            player.score = 0;
          }

          broadcastToRoom(room, {
            type: 'game_state',
            game: room.game,
            players: [...room.players.values()],
          });
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
        ({ name, id, score }) => ({ name, id, score }),
      );
      // send to room: updated users list
      const room = rooms.get(roomId);
      broadcastToRoom(room, { type: 'players', players });
      // room cleanup
      if (playersMap?.size === 0) rooms.delete(roomId);
    }
  });
});

console.log(`WebSocket server listening on port ${PORT}`);
