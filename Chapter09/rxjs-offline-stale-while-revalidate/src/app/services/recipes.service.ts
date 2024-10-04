import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from '../types/recipes.type';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private http: HttpClient) {}

  getRecipes(): Observable<Recipe[]> {    
    return this.http.get<Recipe[]>('/api/recipes');
  }
}
