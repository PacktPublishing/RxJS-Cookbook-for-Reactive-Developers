import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from '../reducers/recipes.types';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  
  constructor(private http: HttpClient) { }

  getRecipes$(): Observable<Recipe[]> {
   return this.http.get<Recipe[]>('https://super-recipes.com/api/recipes');
  }
}
