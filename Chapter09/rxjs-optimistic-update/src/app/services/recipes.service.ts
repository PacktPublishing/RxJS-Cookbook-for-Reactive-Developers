import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../types/recipes.type';
import { BehaviorSubject, Observable } from 'rxjs';
import { optimisticUpdate } from '../operators/optimistic-update.operator';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  private recipe = {
    "id": 1,
    "name": "Spaghetti Aglio e Olio",
    "image": "/assets/images/spaghetti.jpg",
    "description": "Simple yet flavorful pasta with garlic, olive oil, and chili flakes",
    "ingredients": ["spaghetti", "garlic", "olive oil", "chili flakes", "parmesan cheese", "parsley"]
  };
  public recipes: BehaviorSubject<Recipe[]> = new BehaviorSubject<Recipe[]>([]);

  constructor(private http: HttpClient) { }

  postRecipe(): Observable<Recipe> {
    this.recipes.next([...this.recipes.value, this.recipe]);
    return this.http.post<Recipe>('https://super-recipes.com/api/recipes', this.recipe).pipe(
      optimisticUpdate(this.recipe, (originalItem, error) => { 
        // Rollback UI changes here
        console.error('Error updating item:', error); 
        this.recipes.next(this.recipes.value.filter((item) => item !== originalItem));
    }));
  }
}
