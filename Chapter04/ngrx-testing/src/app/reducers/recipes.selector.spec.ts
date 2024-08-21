import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectRecipesState } from './recipes.selector';
import { AppState } from '.';

describe('RecipesSelectors', () => {
    let store: MockStore;

    afterEach(() => {
      store?.resetSelectors();
    });

    const initialState: AppState = {
        recipesState: {
            recipes: [
                {
                    "id": 1,
                    "name": "Spaghetti Aglio e Olio",
                    "description": "Simple yet flavorful pasta with garlic, olive oil, and chili flakes",
                    "ingredients": ["spaghetti", "garlic", "olive oil", "chili flakes", "parmesan cheese", "parsley"],
                    "image": "/assets/images/spaghetti.jpg"
                },
                {
                    "id": 2,
                    "name": "Spaghetti Aglio e Olio",
                    "description": "Simple yet flavorful pasta with garlic, olive oil, and chili flakes",
                    "ingredients": ["spaghetti", "garlic", "olive oil", "chili flakes", "parmesan cheese", "parsley"],
                    "image": "/assets/images/spaghetti.jpg"
                },
            ],
            selectedRecipe: null,
            error: null,
            loading: false
        },
        router: {
            state: {
              url: '/recipes'
            },
            navigationId: 1
        } as any
      };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideMockStore({
            selectors: [
                {
                  selector: selectRecipesState,
                  value: [
                        {
                            "id": 1,
                            "name": "Spaghetti Aglio e Olio",
                            "description": "Simple yet flavorful pasta with garlic, olive oil, and chili flakes",
                            "ingredients": ["spaghetti", "garlic", "olive oil", "chili flakes", "parmesan cheese", "parsley"],
                            "image": "/assets/images/spaghetti.jpg"
                        },
                    ]
                },
            ]
        }),
      ]
    });

    store = TestBed.inject(MockStore);
  });

  it('should select the recipes state', () => {
    const result = selectRecipesState.projector(initialState.recipesState);
    expect(result.recipes.length).toEqual(2);
    expect(result.recipes[0].id).toEqual(1);
  });
});