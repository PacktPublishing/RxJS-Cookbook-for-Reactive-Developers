import { delay, http, HttpResponse } from 'msw'

export const handlers = [
  http.post('https://super-recipes.com/api/recipes/upload', async () => {
    await delay(30000);
    return HttpResponse.json({});
  }),
]
