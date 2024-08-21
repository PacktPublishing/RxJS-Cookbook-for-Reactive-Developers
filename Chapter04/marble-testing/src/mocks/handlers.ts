import { http, HttpResponse } from 'msw'
import { recipes } from './mock.json'

let index = -1;

export const handlers = [
  http.get('https://super-recipes.com/api/recipes', async () => {
    // index++;
    return HttpResponse.json(recipes);
  }),
]
