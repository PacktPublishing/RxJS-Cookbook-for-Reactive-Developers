import { http, HttpResponse } from 'msw'
import { recipes } from './mock.json'

export const handlers = [
  http.get('https://super-recipes.com/api/recipes', async ({ request }) => {
    const url = new URL(request.url);
    const recipeName = url.searchParams.get('name');
    const recipeIngredient = url.searchParams.get('ingredient');
    let filteredRecipes = recipes;

    if (recipeName) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(recipeName.toLowerCase())
      );
    }

    if (recipeIngredient) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().startsWith(recipeIngredient.toLowerCase())
        )
      );
    }



    return HttpResponse.json(filteredRecipes);
  }),
]
