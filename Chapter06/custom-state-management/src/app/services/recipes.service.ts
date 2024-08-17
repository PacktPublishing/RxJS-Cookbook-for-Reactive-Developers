import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, catchError, of, Observable } from 'rxjs';
import { Recipe } from '../store/recipes.types';
import { ofType } from '../store/recipes.utils';
import { RecipesStoreService } from '../store/state/recipes-store.service';
import {
  LOAD_RECIPES,
  loadRecipesAction,
  loadRecipesActionError,
  loadRecipesActionSuccess,
} from '../store/recipes.actions';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  loadRecipes$ = this.recipeStore.createEffect(() => {
    return this.recipeStore.actions$
      .pipe(
        ofType(LOAD_RECIPES),
        exhaustMap(() => this.getRecipes().pipe(
          map(response => loadRecipesActionSuccess(response)),
          catchError((error: Error) => of(loadRecipesActionError(error.message ?? error)))
        ))
      );
  });
  
  constructor(private http: HttpClient, private recipeStore: RecipesStoreService) { 
    this.loadRecipes$.subscribe();
  }

  getRecipes(): Observable<Recipe[]> {
   return this.http.get<Recipe[]>('https://super-recipes.com/api/recipes');
  }

  loadRecipes(): void {
    this.recipeStore.dispatch(loadRecipesAction());
  }
}
