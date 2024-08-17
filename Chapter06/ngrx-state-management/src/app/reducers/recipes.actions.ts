import { createAction, props } from "@ngrx/store";
import { Recipe } from "./recipes.types";

export const  loadRecipesAction = createAction('[Recipes] Load Recipes');
export const  loadRecipesActionSuccess = createAction('[Recipes] Load Recipes Success', props<{ recipes: Recipe[] }>());
export const  loadRecipesActionError = createAction('[Recipes] Load Recipes Error', props<{ error: string }>());