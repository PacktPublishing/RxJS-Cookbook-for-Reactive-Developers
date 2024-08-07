import { delay, http, HttpResponse } from 'msw'
import { recipes } from './mock.json'

export const handlers = [
  http.get('https://super-recipes.com/api/recipes', async () => {
    await delay(7000);

    return HttpResponse.json(recipes);
  }),
]
