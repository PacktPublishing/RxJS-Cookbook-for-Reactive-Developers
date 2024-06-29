import { delay, http, HttpResponse } from 'msw';

export const handlers = [
  http.post('https://super-recipes.com/api/recipes', async () => {
    await delay(5000);
    
    return HttpResponse.json({
      message: 'Recipe created successfully!',
    })
  }),
]
