import { delay, http, HttpResponse } from 'msw'

let numberOfRequest = 0;

export const handlers = [
  http.post('https://super-recipes.com/api/recipes/upload', async () => {
    numberOfRequest++;

    if (numberOfRequest % 2 === 0) {
      await delay(10000);
    } else {
      await delay(5000);
    }
    return HttpResponse.json({});
  }),
]
