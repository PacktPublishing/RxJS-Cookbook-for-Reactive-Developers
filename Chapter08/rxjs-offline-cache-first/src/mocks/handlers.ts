import { http, HttpResponse } from 'msw'
import { recipes } from './mock.json'

export const handlers = [
  http.get('https://super-recipes.com/api/recipes', async () => {
    return HttpResponse.json(recipes);
  }),
]
