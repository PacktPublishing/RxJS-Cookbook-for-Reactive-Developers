import { ws } from 'msw'
import { recipes } from './mock.json'

const socket = ws.link('wss://recipes.example.com')

export const handlers = [
  socket.on('connection', ({ client }: any) => {
    client.addEventListener('message', (event: any) => {
      socket.broadcast(JSON.stringify({
        type: 'recipes',
        payload: recipes,
      }));
    })
  }),
]
