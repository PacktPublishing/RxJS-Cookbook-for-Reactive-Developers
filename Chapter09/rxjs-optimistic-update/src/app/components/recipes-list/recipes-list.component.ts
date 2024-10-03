import { MatButtonModule } from '@angular/material/button';
import { Component } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable, catchError, of } from 'rxjs';
import { RecipeItemComponent } from '../recipe-item/recipe-item.component';
import { Recipe } from '../../types/recipes.type';
import { RecipesService } from '../../services/recipes.service';


@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [CommonModule, RecipeItemComponent, AsyncPipe, MatButtonModule],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.scss'
})
export class RecipesListComponent {
  recipe$: Observable<Recipe> = new Observable<Recipe>();
  recipeError$: Observable<Error> = new Observable<Error>();

  constructor(private recipesService: RecipesService) { }

  postRecipe(): void {
    this.recipe$ = this.recipesService.postRecipe().pipe(
      catchError(error =>  of(error))
    );
  }

}
