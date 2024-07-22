import { createFeature, createReducer, on } from "@ngrx/store";
import * as RecipesActions from './recipes.actions';
import { Recipe } from "./recipes.types";

export interface State {
    recipes: Recipe[];
    selectedRecipe: Recipe | null;
    error: null
    loading: boolean;
}

export const initialState: State = {
    recipes: [],
    selectedRecipe: null,
    error: null,
    loading: false,
}

export const recipeReducer = createReducer(
    initialState,
    on(RecipesActions.loadRecipesAction, state => ({
        ...state,
        loading: true,
    })),
    on(RecipesActions.loadRecipesActionSuccess, (state, { recipes }) => ({
        ...state,
        recipes,
        loading: false,
    })),
);

export const recipesFeature = createFeature({
    name: 'recipesState',
    reducer: recipeReducer,
});