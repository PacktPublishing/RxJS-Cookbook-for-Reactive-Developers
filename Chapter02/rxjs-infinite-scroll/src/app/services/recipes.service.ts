import { Injectable } from '@angular/core';
import {
  Observable, delay,
  switchMap,
  timer
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../types/recipes.type';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {

  constructor(private httpClient: HttpClient) {}

  getRecipes(page: number): Observable<Recipe[]> {
    return this.httpClient.get<Recipe[]>(`https://super-recipes.com/api/recipes?page=${page}`).pipe(
      delay(1000),
    );
  }

  checkNumberOfNewRecipes(): Observable<number> {
    return timer(10000, 100000).pipe(
      switchMap(() => this.httpClient.get<number>('https://super-recipes.com/api/new-recipes'))
    );  
  }
}
