import { delay, http, HttpResponse } from 'msw'
import { recipes } from './mock.json'

let requestNumber = 0;

export const handlers = [
  http.get('https://super-recipes.com/api/recipes', async () => {
    requestNumber++;
    await delay(2000);

    if (requestNumber === 3) {
      return HttpResponse.json([
        ...recipes,
        {
          "id": 6,
          "name": "Chicken Fajitas",
          "description": "Sizzling Mexican dish with chicken, peppers, onions, and tortillas.",
          "ingredients": [
            "chicken breasts",
            "bell peppers",
            "onion",
            "fajita seasoning",
            "lime juice",
            "tortillas",
            "guacamole",
            "sour cream",
            "salsa"
          ],
          "image": "/assets/images/chicken_fajitas.png"
        }
      ]);
    }

    return HttpResponse.json(recipes);
  }),
]
