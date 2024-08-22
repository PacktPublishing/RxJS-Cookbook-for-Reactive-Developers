import { delay, http, HttpResponse } from 'msw'
import { recipes } from './mock.json'

let numberOfRequest = 0;

export const handlers = [
  http.get('https://super-recipes.com/api/recipes', async () => {
    numberOfRequest++;

    if (numberOfRequest === 3) {
      await delay(1000);
    }

    await delay(4000);
    return HttpResponse.json(recipes);
  }),
]