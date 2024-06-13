import { createAction, props } from "@ngrx/store";
import { Recipe } from "./recipes.types";

export const  loadRecipesAction = createAction('[Recipes] Load Recipes');
export const  completeRecipesAction = createAction('[Recipes] Load Recipes Success', props<{ recipes: Recipe[] }>());
export const  completeErrorRecipesAction = createAction('[Recipes] Load Recipes Error');