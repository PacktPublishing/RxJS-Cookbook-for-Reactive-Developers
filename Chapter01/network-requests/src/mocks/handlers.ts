import { delay, http, HttpResponse } from 'msw'
import { recipes, details, images } from './mock.json'

export const handlers = [
  http.get('https://super-recipes.com/api/recipes', async ({ request }) => {
    // Construct a URL instance out of the intercepted request.
    const url = new URL(request.url)
 
    // Read the "id" URL query parameter using the "URLSearchParams" API.
    // Given "/product?id=1", "productId" will equal "1".
    const recipeId = url.searchParams.get('id') || ''
 
    // Note that query parameters are potentially undefined.
    // Make sure to account for that in your handlers.
    if (!recipeId) {
      return HttpResponse.json(recipes)
    }

    const recipe = recipes.find((recipe) => recipe.id === +recipeId)

    if (!recipe) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(recipe)
  }),
  http.get('https://super-recipes.com/api/recipes/details', async ({ request }) => {
    // Construct a URL instance out of the intercepted request.
    const url = new URL(request.url)
 
    // Read the "id" URL query parameter using the "URLSearchParams" API.
    // Given "/product?id=1", "productId" will equal "1".
    const recipeId = url.searchParams.get('id') || ''
    const recipe = details.find((recipe) => recipe.id === +recipeId)
 
    // Note that query parameters are potentially undefined.
    // Make sure to account for that in your handlers.
    if (!recipeId || !recipe) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(recipe)
  }),
  http.get('https://super-recipes.com/api/recipes/images', async ({ request }) => {
    await delay(3000)
    // Construct a URL instance out of the intercepted request.
    const url = new URL(request.url)
 
    // Read the "id" URL query parameter using the "URLSearchParams" API.
    // Given "/product?id=1", "productId" will equal "1".
    const recipeId = url.searchParams.get('id') || ''
    const recipeWithImage = images.find((recipe) => recipe.id === +recipeId)
 
    // Note that query parameters are potentially undefined.
    // Make sure to account for that in your handlers.
    if (!recipeId || !recipeWithImage) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(recipeWithImage)
  }),
]
