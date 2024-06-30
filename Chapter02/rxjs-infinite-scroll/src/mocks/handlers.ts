import { http, HttpResponse } from 'msw'
import { recipes } from './mock.json'

export const handlers = [
  http.get('https://super-recipes.com/api/recipes', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;

    const recipesPerPage = recipes.slice((page - 1) * 5, page * 5);

    return HttpResponse.json(recipesPerPage);
  }),
]