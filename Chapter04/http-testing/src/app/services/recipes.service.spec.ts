import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestScheduler } from 'rxjs/testing';
import { RecipesService } from './recipes.service';
import { firstValueFrom, of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { Recipe } from '../types/recipes.type';

describe('RecipesService', () => {
  let service: RecipesService;
  let httpMock: HttpTestingController;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        RecipesService
      ],
    });

    service = TestBed.inject(RecipesService);
    httpMock = TestBed.inject(HttpTestingController);
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch a list of recipes', async () => {
    const mockResponse = [
      {
        "id": 1,
        "name": "Spaghetti Aglio e Olio",
        "description": "Simple yet flavorful pasta with garlic, olive oil, and chili flakes",
        "ingredients": ["spaghetti", "garlic", "olive oil", "chili flakes", "parmesan cheese", "parsley"]
      },
      {
          "id": 2,
          "name": "Chicken Tikka Masala",
          "description": "Creamy, spiced Indian curry with tender chicken pieces.",
          "ingredients": ["chicken breasts", "yogurt", "garam masala", "turmeric", "cumin", "tomatoes", "onion", "ginger", "garlic", "heavy cream"]
      },
    ];

    const recipes$ = service.getRecipes$();
    const recipes = firstValueFrom(recipes$);

    const request = httpMock.expectOne('https://super-recipes.com/api/recipes');
    request.flush(mockResponse);

    expect(await recipes).toEqual(mockResponse);
    expect((await recipes).length).toEqual(2);
  });

  it('should fetch recipe details', async () => {
    const dummyRecipe = {
      "id": 1,
      "name": "Spaghetti Aglio e Olio",
      "description": "Simple yet flavorful pasta with garlic, olive oil, and chili flakes",
      "ingredients": ["spaghetti", "garlic", "olive oil", "chili flakes", "parmesan cheese", "parsley"]
    };
    const dummyDetails = {
      "id": 1,
      "prepTime": 7200000,
      "cuisine": "Italian",
      "diet": "Vegetarian",
      "url": "/assets/images/spaghetti.jpg",
      "nutrition": {
          "calories": 450,
          "fat": 15,
          "carbs": 70,
          "protein": 10
      }
    };

    const recipeDetails$ = service.getRecipeDetails$(dummyRecipe.id);
    const recipeDetails = firstValueFrom(recipeDetails$);

    const req1 = httpMock.expectOne(`https://super-recipes.com/api/recipes?id=${dummyRecipe.id}`);
    expect(req1.request.method).toBe('GET');
    req1.flush(dummyRecipe);

    const req2 = httpMock.expectOne(`https://super-recipes.com/api/recipes/details?id=${dummyRecipe.id}`);
    expect(req2.request.method).toBe('GET');
    req2.flush(dummyDetails);

    expect((await recipeDetails).recipe).toEqual(dummyRecipe);
    expect((await recipeDetails).details).toEqual(dummyDetails);

  });

  it('should fetch recipes with images in parallel', async () => {
    const dummyRecipes = [
      { id: '1', name: 'Recipe 1' },
      { id: '2', name: 'Recipe 2' }
    ];

    const dummyImages = [
      { id: '1', imageUrl: 'Image 1' },
      { id: '2', imageUrl: 'Image 2' }
    ];

    const recipeImages$ = service.getRecipesWithImageInParallel$();
    const recipeImages = firstValueFrom(recipeImages$);

    const req = httpMock.expectOne('https://super-recipes.com/api/recipes');
    expect(req.request.method).toBe('GET');
    req.flush(dummyRecipes);

    dummyRecipes.forEach((recipe, index) => {
      const imgReq = httpMock.expectOne(`https://super-recipes.com/api/recipes/images?id=${recipe.id}`);
      expect(imgReq.request.method).toBe('GET');
      imgReq.flush(dummyImages[index]);
    });
    
    expect(await recipeImages).toEqual(dummyImages);
  });

  fit('should handle error when fetching recipes', async () => {
    const recipes$ = service.getRecipes$();
    const recipes = firstValueFrom(recipes$);

      const req = httpMock.expectOne('https://super-recipes.com/api/recipes');
      expect(req.request.method).toBe('GET');
      req.flush('Failed!', {status: 500, statusText: 'Error fetching recipes'}); 
      const recipesResponse = await recipes;
      expect(recipesResponse).toBeInstanceOf(Error);
      expect(recipesResponse.message).toEqual('Error fetching recipes');
 
  });
});
