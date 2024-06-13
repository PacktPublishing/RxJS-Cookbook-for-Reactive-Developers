import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, catchError, of, Observable } from 'rxjs';
import { Recipe } from '../store/recipes.types';
import { ofType } from '../store/recipes.utils';
import { RecipesStoreService } from '../store/state/recipes-store.service';
import { LOAD_RECIPES, LOAD_RECIPES_ERROR, LOAD_RECIPES_SUCCESS, loadRecipesAction } from '../store/recipes.actions';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  loadRecipes$ = this.recipeStore.createEffect(() => {
    return this.recipeStore.actions$
      .pipe(
        ofType(LOAD_RECIPES),
        exhaustMap(() => this.getRecipes().pipe(
          map(response => ({ type: LOAD_RECIPES_SUCCESS, payload: response })),
          catchError((error) => of({ type: LOAD_RECIPES_ERROR, payload: error.message ?? error }))
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
