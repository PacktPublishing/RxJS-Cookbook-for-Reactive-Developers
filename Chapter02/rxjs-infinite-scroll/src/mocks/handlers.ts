import { delay, http, HttpResponse } from 'msw'
import { recipes } from './mock.json'

let numberOfRequest = 0;
let numberOfRecipesNumberRequest = 0;

export const handlers = [
  http.get('https://super-recipes.com/api/recipes', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;

    if (page === 1) {
      numberOfRequest++;
    }

    if (numberOfRequest === 2) {
      const newRecipes = [
        {
          "id": "d9e8e7e6-e5d4-d3e2-e78a-2a756a4a2e93",
          "name": "Tuna Salad Sandwich",
          "description": "Classic sandwich with tuna, mayonnaise, celery, and onion.",
          "ingredients": [
            "canned tuna",
            "mayonnaise",
            "celery",
            "red onion",
            "lemon juice",
            "salt",
            "pepper",
            "bread"
          ],
          "image": "/assets/images/tuna_salad_sandwich.png"
        },
        {
          "id": "e9d8e7e6-e5d4-d3e2-e78a-2a756a4a2e93",
          "name": "Mushroom Risotto",
          "description": "Creamy Italian rice dish with mushrooms and Parmesan cheese.",
          "ingredients": [
            "arborio rice",
            "mushrooms",
            "onion",
            "garlic",
            "white wine",
            "vegetable broth",
            "Parmesan cheese",
            "butter",
            "thyme",
            "salt",
            "pepper"
          ],
          "image": "/assets/images/mushroom_risotto.png"
        },
        ...recipes,
      ];

      const recipesPerPage = newRecipes.slice((page - 1) * 5, page * 5);

      await delay(1000);
      return HttpResponse.json(recipesPerPage);
    }
    const recipesPerPage = recipes.slice((page - 1) * 5, page * 5);

    await delay(1000);
    return HttpResponse.json(recipesPerPage);
  }),
  http.get('https://super-recipes.com/api/new-recipes', async ({ request }) => {
    numberOfRecipesNumberRequest++;
    await delay(3000);

    if (numberOfRecipesNumberRequest > 0) {
      return HttpResponse.json(2);
    }

    return HttpResponse.json(0);
  }),
]