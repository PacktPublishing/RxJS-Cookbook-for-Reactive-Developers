import { getRouterSelectors } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRecipes from './recipes.reducer';
import * as fromRouter from '@ngrx/router-store';

export const {
    selectCurrentRoute, // select the current route
    selectFragment, // select the current route fragment
    selectQueryParams, // select the current route query params
    selectQueryParam, // factory function to select a query param
    selectRouteParams, // select the current route params
    selectRouteParam, // factory function to select a route param
    selectRouteData, // select the current route data
    selectRouteDataParam, // factory function to select a route data param
    selectUrl, // select the current url
    selectTitle, // select the title if available
} = getRouterSelectors();

export const selectRecipesState = createFeatureSelector<fromRecipes.State>('recipesState');

export const selectRecipesWithCurrentRoute = createSelector(
    selectRecipesState,  
    selectCurrentRoute, 
    (recipesState: fromRecipes.State, routerState: fromRouter.RouterReducerState) => ({ recipesState, routerState })
);

export const selectRecipesWithSelectedRecipes = createSelector(
    selectRecipesState,
    (state: fromRecipes.State) => state.selectedRecipe
);
