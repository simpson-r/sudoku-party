import { randomUUID } from 'node:crypto';
import { WebSocket, WebSocketServer } from 'ws';
import type { ClientMessage, Player, Room, ServerMessage } from './types.js';

// constants
const PORT = 8080;


// setup
const wss = new WebSocketServer({ port: PORT });
const rooms = new Map<string, Room>();

// room functionality
function broadcastToRoom(
  roomId: string,
  data: ServerMessage,
  ignoreSocket?: WebSocket,
) {
  const players = rooms.get(roomId)!.players;
  for (const player of players.values()) {
    const { socket } = player;
    if (socket.readyState === WebSocket.OPEN && socket !== ignoreSocket) {
      socket.send(JSON.stringify(data));
    }
  }
}

wss.on('connection', (ws) => {
  const userId = randomUUID();
  let roomId: string | null = null;
  let name: string | null = null;

  // message handling
  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message.toString()) as ClientMessage;

      switch (msg.type) {
        case 'join': {
          roomId = msg.roomId;
          name = msg.name;

          if (!rooms.get(roomId)) {
            rooms.set(roomId, { players: new Map<string, Player>() }); // create room if it doesn't exist
          }

          const players = rooms.get(roomId)!.players;
          players.set(userId, { id: userId, name, socket: ws });

          // broadcast room join
          broadcastToRoom(
            roomId,
            {
              type: 'notification',
              message: `${name} joined the room.`,
            },
            ws,
          );

          const users = Array.from(players.values() ?? [])
            .map((client) => client.name)
            .filter(Boolean);

          // broadcast users list
          broadcastToRoom(roomId, { type: 'users', users });
          break;
        }
      }
    } catch (err) {
      console.error('Invalid message received:', message);
    }
  });

  // close handling
  ws.on('close', () => {
    if (roomId && rooms.get(roomId)) {
      const players = rooms.get(roomId)?.players;
      players?.delete(userId);

      broadcastToRoom(roomId, {
        type: 'notification',
        message: `${name} left the room.`,
      });

      const users = Array.from(players?.values() ?? []).map(
        (player) => player.name,
      );

      // broadcast updated users list
      broadcastToRoom(roomId, { type: 'users', users });

      // room cleanup
      if (players?.size === 0) rooms.delete(roomId);
    }
  });
});

console.log(`WebSocket server listening on port ${PORT}`);
