import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../types/recipes.type';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  constructor(private httpClient: HttpClient) {}

  getRecipes$(): Observable<Recipe[]> {
    return this.httpClient.get<Recipe[]>(
      'https://super-recipes.com/api/recipes'
    );
  }

  searchRecipes$(
    searchTerm: string,
    searchIngredient: string
  ): Observable<Recipe[]> {
    return this.httpClient.get<Recipe[]>(
      `https://super-recipes.com/api/recipes?name=${searchTerm}&ingredient=${searchIngredient}`
    );
  }
}
