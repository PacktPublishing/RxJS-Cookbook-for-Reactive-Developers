import { http, HttpResponse } from 'msw'
import { recipes } from './mock.json'

export const handlers = [
  http.get('https://super-recipes.com/api/recipes', () => {
    return HttpResponse.json(recipes);
  }),
  http.post('https://super-recipes.com/api/analytics', (errorData) => {
    return HttpResponse.json(errorData);
  }),
]