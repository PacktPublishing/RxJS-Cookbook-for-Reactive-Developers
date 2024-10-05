import { delay, http, HttpResponse } from 'msw'
import { recipes } from './mock.json'

export const handlers = [
  http.get('/api/recipes', async () => {
    await delay(2000);
    return HttpResponse.json(recipes);
  }),
]
