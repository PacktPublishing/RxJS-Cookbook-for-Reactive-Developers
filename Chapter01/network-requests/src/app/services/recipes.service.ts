import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  forkJoin,
  from,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Recipe, RecipeDetails } from '../types/recipes.type';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  public recipes = new BehaviorSubject<Recipe[]>([]);

  constructor(private httpClient: HttpClient) {}

  getRecipes$(): Observable<Recipe[]> {
    return this.httpClient.get<Recipe[]>(
      'https://super-recipes.com/api/recipes'
    );
  }

  getRecipesWithImageInParallel$(): Observable<Object[]> {
    return this.getRecipes$().pipe(
      tap((recipes: Recipe[]) => this.recipes.next(recipes)),
      switchMap((recipes: Recipe[]) => {
        const imageRequests = recipes.map((recipe) =>
          this.httpClient.get(
            `https://super-recipes.com/api/recipes/images?id=${recipe.id}`
          )
        );

        return forkJoin(imageRequests);
      }),
    );
  }

  getRecipesWithConcurrentImage$(): Observable<any> {
    return this.getRecipes$().pipe(
      tap((recipes: Recipe[]) => this.recipes.next(recipes)),
      switchMap((recipes: Recipe[]) => {
        const imageIds = recipes.map((recipe) => recipe.id);

        return from(imageIds).pipe(
          mergeMap(
            (id) =>
              this.httpClient.get<{ id: string; image: string }[]>(
                `https://super-recipes.com/api/recipes/images?id=${id}`
              ),
            3
          ),
        );
      })
    );
  }

  getRecipeById$(id: number): Observable<Recipe> {
    return this.httpClient.get<Recipe>(
      `https://super-recipes.com/api/recipes?id=${id}`
    );
  }

  getRecipeDetails$(
    id: number
  ): Observable<{ recipe: Recipe; details: RecipeDetails }> {
    return this.getRecipeById$(id).pipe(
      switchMap((recipe: Recipe) => {
        return this.httpClient
          .get<RecipeDetails>(
            `https://super-recipes.com/api/recipes/details?id=${id}`
          )
          .pipe(map((details) => ({ recipe, details })));
      })
    );
  }
}
