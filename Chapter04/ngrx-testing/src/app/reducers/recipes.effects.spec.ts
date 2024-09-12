import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';
import { RecipesEffects } from './recipes.effects';
import { RecipesService } from '../services/recipes.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Action } from '@ngrx/store';
import { loadRecipesAction, loadRecipesActionSuccess, loadRecipesActionError } from './recipes.actions';
import { provideHttpClient } from '@angular/common/http';

describe('RecipesEffects', () => {
  let actions$: Observable<Action>;
  let effects: RecipesEffects;
  let recipesService: RecipesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        RecipesEffects,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore(),
        provideMockActions(() => actions$),
        RecipesService
      ]
    });

    effects = TestBed.inject(RecipesEffects);
    recipesService = TestBed.inject(RecipesService);
  });

  it('should dispatch loadRecipesActionSuccess when the service responds with recipes', async () => {
    const recipes = [
      {
          "id": 1,
          "name": "Spaghetti Aglio e Olio",
          "description": "Simple yet flavorful pasta with garlic, olive oil, and chili flakes",
          "ingredients": ["spaghetti", "garlic", "olive oil", "chili flakes", "parmesan cheese", "parsley"],
          "image": "/assets/images/spaghetti.jpg"
      },
      {
          "id": 2,
          "name": "Chicken Tikka Masala",
          "description": "Creamy, spiced Indian curry with tender chicken pieces.",
          "ingredients": ["chicken breasts", "yogurt", "garam masala", "turmeric", "cumin", "tomatoes", "onion", "ginger", "garlic", "heavy cream"],
          "image": "/assets/images/chicken_tikka_masala.jpg"
      },
      {
          "id": 3,
          "name": "Chocolate Chip Cookies",
          "description": "Classic chewy cookies with melty chocolate chips.",
          "ingredients": ["butter", "sugar", "brown sugar", "eggs", "vanilla extract", "flour", "baking soda", "salt", "chocolate chips"],
          "image": "/assets/images/chocolate_chip_cookies.jpg"
      },
      {
          "id": 4,
          "name": "Caprese Salad",
          "description": "Refreshing Italian salad with tomatoes, mozzarella, and basil.",
          "ingredients": ["tomatoes", "mozzarella cheese", "basil", "balsamic vinegar", "olive oil", "salt", "pepper"],
          "image": "/assets/images/caprese_salad.jpg"
      },
      {
          "id": 5,
          "name": "Beef Stir-Fry",
          "description": "Quick and easy stir-fry with beef, vegetables, and a savory sauce.",
          "ingredients": ["beef strips", "broccoli", "carrots", "bell peppers", "soy sauce", "hoisin sauce", "ginger", "garlic", "vegetable oil"],
          "image": "/assets/images/beef_stir_fry.jpg"
      }
    ];
    spyOn(recipesService, 'getRecipes$').and.returnValue(of([
      ...recipes,
      // {
      //   "id": 6,
      //   "name": "Spaghetti Carbonara",
      //   "description": "Rich and creamy pasta with pancetta, eggs, and cheese.",
      //   "ingredients": ["spaghetti", "pancetta", "eggs", "parmesan cheese", "black pepper"],
      //   "image": "/assets/images/spaghetti_carbonara"
      // }
    ]));
  
    actions$ = of(loadRecipesAction());
  
    const effectResult = await firstValueFrom(effects.loadRecipes$);
    expect(effectResult).toEqual(loadRecipesActionSuccess({ recipes }));
  });

  it('should dispatch loadRecipesActionError when the service responds with an error', async () => {
    const error = new Error('Error loading recipes');
    spyOn(recipesService, 'getRecipes$').and.returnValue(throwError(() => error));

    actions$ = of(loadRecipesAction());

    const resultAction = await firstValueFrom(effects.loadRecipes$);
    expect(resultAction).toEqual(loadRecipesActionError({ error: error.message }));
  });
});