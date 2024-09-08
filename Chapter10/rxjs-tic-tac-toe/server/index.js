const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });
let currentPlayer = 'X';

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  if (wss.clients.size > 2) {
    ws.send('Game already started');
  }

  if (wss.clients.size === 1) {
    ws.send(JSON.stringify({ type: 'playerJoined', message: 'X' }));
  }

  if (wss.clients.size === 2) {
    ws.send(JSON.stringify({ type: 'playerJoined', message: 'O' }));
  }

  ws.on('message', function incoming(data, isBinary) {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    console.log('Received: %s', data);
    const newData = JSON.parse(data);
    newData.message.currentPlayer = currentPlayer;
    // Broadcast the message to all connected clients
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(newData), { binary: isBinary });      
      }
    });
  });
});