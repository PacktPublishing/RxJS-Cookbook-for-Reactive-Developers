import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('https://super-recipes.com/api/recipes', async () => {
    return HttpResponse.json();
  }),
]
