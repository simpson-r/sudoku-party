import { randomUUID } from 'node:crypto';
import { WebSocket, WebSocketServer } from 'ws';

// constants
const PORT = 8080;

// types
type Player = { id: string; name: string; socket: WebSocket };
type PlayerInfo = { id: string; name: string };
type Room = { players: Map<string, Player> };

type ClientMessage =
  | { type: 'join'; roomId: string; name: string }
  | { type: 'chat'; message: string }
  | { type: 'cell_update'; row: number; col: number; value: number | null };

type ServerMessage =
  | { type: 'notification'; message: string }
  | { type: 'chat'; message: string; name: string }
  | { type: 'users'; users: string[] }
  | { type: 'cell_updated'; row: number; col: number; value: number | null }
  | { type: 'player_joined'; player: PlayerInfo }
  | { type: 'player_left'; playerId: string };

// setup
const wss = new WebSocketServer({ port: PORT });
const rooms = new Map<string, Room>();

// room functionality 
function broadcastToRoom(
  roomId: string,
  data: ServerMessage,
  exceptSocket?: WebSocket,
) {
  const players = rooms.get(roomId)!.players;
  for (const player of players.values()) {
    const { socket } = player;
    if (socket.readyState === WebSocket.OPEN && socket !== exceptSocket) {
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
        case 'chat': {
          if (!roomId || !name) return;
          broadcastToRoom(roomId, {
            type: 'chat',
            message: msg.message,
            name,
          });
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
