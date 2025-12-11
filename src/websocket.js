
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', ws => {
  console.log('Client connected');
  ws.on('message', message => {
    console.log(`Received message: ${message}`);
  });
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

export const upgrade = (server) => {
  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, ws => {
      wss.emit('connection', ws, request);
    });
  });
};

export const broadcast = (data) => {
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // 1 is OPEN
      client.send(JSON.stringify(data));
    }
  });
};
