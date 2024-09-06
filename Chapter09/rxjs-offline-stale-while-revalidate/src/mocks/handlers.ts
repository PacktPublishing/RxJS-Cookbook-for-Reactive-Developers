import { http, HttpResponse } from 'msw'
import { recipes } from './mock.json'

export const handlers = [
  http.get('https://super-recipes.com/api/recipes', async () => {
    return HttpResponse.json([...recipes, {
      id: recipes.length + 1,
      title: `Recipe ${recipes.length + 1}`,
      description: 'This is a new recipe',
      ingredients: ['Ingredient 1', 'Ingredient 2'],
    }])
  }),
]
