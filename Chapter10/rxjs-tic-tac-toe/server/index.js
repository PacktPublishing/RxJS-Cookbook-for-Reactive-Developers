const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });
let currentPlayer = 'X';
let clients = [];

wss.on('connection', function connection(ws) {
  clients.push(ws);

  if (wss.clients.size > 2) {
    ws.send('Game already started');
  }

  ws.on('message', function incoming(data, isBinary) {
    const newData = JSON.parse(data);
    const { type } = newData;
    if (type === 'join') {
      if (clients.length === 1) {
        clients[0].send(JSON.stringify({ type: 'playerJoined', message: 'X' }));
      } else if (clients.length === 2) {
        clients[1].send(JSON.stringify({ type: 'playerJoined', message: 'O' }));
      }
    }

    // Broadcast the message to all connected clients
    if (type === 'move') {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      newData.message = {
        ...newData.message,
        currentPlayer,
      };

      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          console.log('Sending: %s', JSON.stringify(newData));
          client.send(JSON.stringify({
            type: 'boardUpdate',
            message: newData.message
          }), { binary: isBinary });          
        }
      });

    }
  });
});