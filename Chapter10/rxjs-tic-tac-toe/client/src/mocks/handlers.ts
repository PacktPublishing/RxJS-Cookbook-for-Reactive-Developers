import { delay, ws } from 'msw'

const socket = ws.link('ws://tic-tac-toe.example.com')
const clients: any = []

export const handlers = [
  socket.on('connection', ({ client }: any) => {
    clients.push(client)
    console.log('CLIENTS', clients)
    client.addEventListener('message', async ({ data }: any) => {
      socket.broadcast(JSON.stringify({
        type: 'move',
        payload: data,
      }));
    })
  }),
]
