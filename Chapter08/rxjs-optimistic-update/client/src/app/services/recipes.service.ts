import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, filter, tap } from 'rxjs';
import { Recipe } from '../types/recipes.type';
import { optimisticUpdate } from '../operators/optimistic-update.operator';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private recipe = {
    id: 1,
    name: 'Spaghetti Aglio e Olio',
    image: '/assets/images/spaghetti.jpg',
    description:
      'Simple yet flavorful pasta with garlic, olive oil, and chili flakes',
    ingredients: [
      'spaghetti',
      'garlic',
      'olive oil',
      'chili flakes',
      'parmesan cheese',
      'parsley',
    ],
  };
  public recipes$ = new Subject<Recipe | Error>();

  constructor(private http: HttpClient) {}

  postRecipe(): void {
    this.http
      .post<Recipe>('http://localhost:3000/api/recipes', this.recipe)
      .pipe(
        optimisticUpdate(this.recipe, (originalItem: Recipe, error: Error) => {
          // Rollback UI changes here
          console.error('Error updating item:', originalItem);
          this.recipes$.next(error);
        }),
        filter((recipe) => !!recipe)
      )
      .subscribe((recipe: Recipe) => this.recipes$.next(recipe));
  }
}
