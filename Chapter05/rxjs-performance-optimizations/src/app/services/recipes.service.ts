import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private http: HttpClient) { }

  getRecipes$(recipe: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`https://super-recipes.com/api/recipes?recipe=${recipe}`);
   }
}
