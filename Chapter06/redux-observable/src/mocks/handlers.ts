import { delay, http, HttpResponse } from 'msw'
import { recipes } from './mock.json'

export const handlers = [
  http.get('https://super-recipes.com/api/recipes', async () => {
    await delay(2000);

    return HttpResponse.json(recipes);
  }),
  http.get('https://super-recipes.com/api/recipes/:id', async ({ params }) => {
    return HttpResponse.json(recipes.find((recipe) => recipe.id === +params.id[0]));
  }),
]