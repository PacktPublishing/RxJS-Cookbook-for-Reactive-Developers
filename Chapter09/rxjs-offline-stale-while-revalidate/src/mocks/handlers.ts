import { delay, http, HttpResponse } from 'msw'
import { recipes } from './mock.json'

export const handlers = [
  http.get('/api/recipes', async () => {
    await delay(7000);
    return HttpResponse.json([...recipes, {
      id: '6',
      title: 'Chicken Alfredo',
      description: 'A delicious pasta dish with chicken and creamy Alfredo sauce.',
      image: '/assets/images/chicken-alfredo.png',
      "ingredients": [
        "chicken breasts", 
        "fettuccine pasta", 
        "butter", 
        "heavy cream", 
        "garlic", 
        "parmesan cheese", 
        "Italian seasoning", 
        "salt", 
        "pepper"
      ],
      }
    ])
  }),
]
