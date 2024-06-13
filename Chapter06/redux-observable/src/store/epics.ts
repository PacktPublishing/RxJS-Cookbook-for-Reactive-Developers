// epics.ts
import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { fetchRecipes, fetchRecipesError, fetchRecipesSuccess } from './reducer';
import { getRecipes$ } from '../services/recipes.service';
import { of } from 'rxjs';

export const fetchRecipesEpic = (action$: any) =>
  action$.pipe(
    ofType(fetchRecipes.type),
    switchMap(() => getRecipes$().pipe(
      map(fetchRecipesSuccess),
      catchError(error => of(fetchRecipesError(error.message)))
    ))
  );