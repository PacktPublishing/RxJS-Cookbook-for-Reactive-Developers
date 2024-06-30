import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  delay,
  finalize,
  interval,
  map,
  merge,
  scan,
  takeUntil
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
}
