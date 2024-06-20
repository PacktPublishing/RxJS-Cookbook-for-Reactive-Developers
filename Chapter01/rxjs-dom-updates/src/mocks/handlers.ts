import { http, HttpResponse } from 'msw'
import { recipes } from './mock.json'

export const handlers = [
  http.get('https://super-recipes.com/api/recipes', async ({ request }) => {
    const url = new URL(request.url);
    const recipeName = url.searchParams.get('name');

    if (recipeName) {
      const filteredRecipes = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(recipeName.toLowerCase())
      );

      return HttpResponse.json(filteredRecipes);
    }

    return HttpResponse.json(recipes);
  }),
]
