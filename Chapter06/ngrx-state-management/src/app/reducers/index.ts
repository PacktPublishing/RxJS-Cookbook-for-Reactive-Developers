import { ActionReducerMap } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { routerReducer } from '@ngrx/router-store';
import * as fromRecipes from './recipes.reducer';
import { Recipe } from './recipes.types';

export interface RecipesState {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  error: null;
  loading: boolean;
}

export interface AppState {
  recipesState: RecipesState;
  router: fromRouter.RouterReducerState;
}

export const reducers: ActionReducerMap<AppState> = {
  recipesState: fromRecipes.recipeReducer,
  router: routerReducer,
};
