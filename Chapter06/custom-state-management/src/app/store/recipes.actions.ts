import { Reducer } from "./recipes.reducer";
import { AppState } from "./recipes.types";

export interface Action {
    type: string;
    payload?: any;
}

export const LOAD_RECIPES = 'LOAD_RECIPES';
export const LOAD_RECIPES_SUCCESS = 'LOAD_RECIPES_SUCCESS';
export const LOAD_RECIPES_ERROR = 'LOAD_RECIPES_ERROR';
export const SELECT_RECIPE = 'SELECT_RECIPE';
export const ORDER_RECIPE = 'ORDER_RECIPE';

export const loadRecipesAction = (): Action => ({ type: LOAD_RECIPES });
export const completeRecipesAction = (): Action => ({ type: LOAD_RECIPES_SUCCESS });
export const completeErrorRecipesAction = (): Action => ({ type: LOAD_RECIPES_ERROR });
export const selectRecipeAction = () => ({ type: SELECT_RECIPE });
export const orderRecipeAction = () => ({ type: ORDER_RECIPE });

export function on(actionType: string, reducerFn: Reducer<AppState, Action>) {
    return { actionType, reducerFn };
}