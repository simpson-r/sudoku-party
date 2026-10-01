import { createServer } from 'http';
import { WebSocketServer } from 'ws';

import {
  buildRemainingCounts,
  parseDifficulty,
  updateBoard,
} from '../../shared/helpers.js';
import type {
  ClientMessage,
  Difficulty,
  SudokuDigit,
} from '../../shared/types.js';
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
const PORT = Number(process.env.PORT) || 8080;
const MAX_PLAYERS = 3;

// http server
const server = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    return;
  }

  res.writeHead(404);
  res.end();
});
// ws server
const wss = new WebSocketServer({ server });

// state
const rooms = new Map<string, Room>();

// websocket handling
wss.on('connection', (ws) => {
  let roomId: string | null = null;
  let name: string | null = null;
  let difficulty: Difficulty | null = null;
  let playerId: string | null = null;

  // message handling
  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message.toString()) as ClientMessage;

      switch (msg.type) {
        case 'join': {
          roomId = msg.roomId;
          playerId = msg.playerId;

          difficulty = parseDifficulty(roomId);

          const room = createOrGetRoom(rooms, roomId, difficulty || 'medium');
          if (room.players.size >= MAX_PLAYERS) {
            ws.send(JSON.stringify({ type: 'error', code: 'ROOM_FULL' })); // send room to user
            return;
          }

          const player = room.players.get(msg.playerId);

          if (player) {
            player.socket = ws;
            player.connected = true;
            if (player.disconnectTimer) {
              clearTimeout(player.disconnectTimer);
              player.disconnectTimer = undefined;
            }
          } else {
            // create new player
            name = `Player ${room.nextPlayerIndex}`;
            room.nextPlayerIndex++;
            room.players.set(playerId, {
              id: msg.playerId,
              name,
              socket: ws,
              score: 0,
              connected: true,
            });
          }

          playerId = msg.playerId;

          const players = Array.from(room.players.values()).map(
            ({ name, id, score }) => ({ name, id, score }),
          );

          broadcastToRoom(room, {
            type: 'player_joined',
            player: room.players.get(playerId)!,
          }); // send player joined event

          ws.send(
            JSON.stringify({
              type: 'game_state',
              game: room.game,
              players,
              remaining: buildRemainingCounts(room.game.board),
            }),
          ); // send game state to user

          break;
        }
        case 'cell_update': {
          if (!roomId || !playerId) return;

          const room = rooms.get(roomId);
          if (!room) return;

          const { row, col, value } = msg;
          if (!isValidPosition(row, col)) return; // return if invalid pos

          const cell = getCell(room.game.board, msg);

          if (!cell || cell.value === cell.actual) return; // return so that correct cells remain locked-in

          if (value !== null) {
            const remaining = buildRemainingCounts(room.game.board); // ignore digits that have already been fully placed
            if (!remaining[value]) return;
          }

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

          for (const player of room.players.values()) player.score = 0; // reset scores

          room.game = {
            board: generateSudokuGame(difficulty || 'medium'),
            startedAt: Date.now(),
          };

          broadcastToRoom(room, {
            type: 'game_state',
            game: room.game,
            players: [...room.players.values()],
            remaining: buildRemainingCounts(room.game.board),
          });
        }
      }
    } catch (err) {
      console.error('Failed to handle message:', err);
    }
  });

  ws.on('close', () => {
    if (!roomId || !playerId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.get(playerId);
    if (!player) return;
    if (player.socket !== ws) return; // ignore close events from stale/replaced connections

    player.connected = false;

    const disconnectedPlayerId = playerId;
    const disconnectedRoomId = roomId;

    player.disconnectTimer = setTimeout(() => {
      const currentPlayer = room.players.get(disconnectedPlayerId);
      if (!currentPlayer || currentPlayer.connected) return; // player may have reconnected during the grace period

      room.players.delete(disconnectedPlayerId);

      broadcastToRoom(room, {
        type: 'player_left',
        playerName: currentPlayer.name,
      });

      const players = [...room.players.values()].map(({ name, id, score }) => ({
        name,
        id,
        score,
      }));

      broadcastToRoom(room, { type: 'players', players });

      if (room.players.size === 0) rooms.delete(disconnectedRoomId);
    }, 30_000);
  });
});

// start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on ${PORT}`);
});
