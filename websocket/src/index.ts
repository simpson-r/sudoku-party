import { WebSocketServer } from 'ws';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log(`WebSocket server listening on port ${PORT}`);