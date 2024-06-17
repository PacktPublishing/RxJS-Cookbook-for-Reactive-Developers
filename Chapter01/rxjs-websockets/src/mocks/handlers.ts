import { ws } from 'msw'
import { recipes } from './mock.json'

const socket = ws.link('wss://recipes.example.com')

export const handlers = [
  socket.on('connection', ({ client }: any) => {
    console.log('outgoing WebSocket connection')

    client.addEventListener('message', (event: any) => {
      console.log('received', event.data)
      socket.broadcast(JSON.stringify({
        type: 'recipes',
        payload: recipes,
      }));
    })
  }),
]
