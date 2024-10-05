import { delay, ws } from 'msw'
import { orders } from './mock.json'

const socket = ws.link('wss://recipes.example.com')

export const handlers = [
  socket.on('connection', ({ client }: any) => {
    client.addEventListener('message', async (event: any) => {
      socket.broadcast(JSON.stringify({
        type: 'orders',
        payload: orders[0],
      }));

      await delay(1000);

      socket.broadcast(JSON.stringify({
        type: 'orders',
        payload: orders[1],
      }));

      await delay(1000);

      socket.broadcast(JSON.stringify({
        type: 'orders',
        payload: orders[2],
      }));

      await delay(1000);

      socket.broadcast(JSON.stringify({
        type: 'orders',
        payload: orders[3],
      }));
    })
  }),
]
