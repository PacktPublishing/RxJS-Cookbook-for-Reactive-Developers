import { delay, ws } from 'msw'
import { recipes } from './mock.json'

const socket = ws.link('wss://recipes.example.com')

export const handlers = [
  socket.on('connection', ({ client }: any) => {
    client.addEventListener('message', async (event: any) => {
      if (JSON.parse(event.data).type === 'heartbeat') {
        socket.broadcast(JSON.stringify({
          type: 'heartbeat',
          payload: 'I\'m alive!',
        }));
      }

      if (JSON.parse(event.data).type === 'recipes') {
        socket.broadcast(JSON.stringify({
          type: 'recipes',
          payload: recipes,
        }));
  
        await delay(7000);
  
        socket.broadcast(JSON.stringify({
          type: 'recipes',
          payload: [
            ...recipes,
            {
              "id": 6,
              "name": "Chicken Fajitas",
              "description": "Sizzling Mexican dish with chicken, peppers, onions, and tortillas.",
              "ingredients": [
                "chicken breasts",
                "bell peppers",
                "onion",
                "fajita seasoning",
                "lime juice",
                "tortillas",
                "guacamole",
                "sour cream",
                "salsa"
              ],
              "image": "/assets/images/chicken_fajitas.png"
            }
          ],
        }));
      }
    })
  }),
]
