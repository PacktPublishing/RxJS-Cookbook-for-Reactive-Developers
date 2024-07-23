// epics.ts
import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { fetchRecipes, fetchRecipesError, fetchRecipesSuccess } from './reducer';
import { getRecipes$ } from '../services/recipes.service';
import { of, Observable } from 'rxjs';
import { Action } from 'redux';

export const fetchRecipesEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(fetchRecipes.type),
    switchMap(() => getRecipes$().pipe(
      map(fetchRecipesSuccess),
      catchError(error => of(fetchRecipesError(error.message)))
    ))
  );