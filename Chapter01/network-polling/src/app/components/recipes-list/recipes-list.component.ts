import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RecipeItemComponent } from '../recipe-item/recipe-item.component';
import { Recipe } from '../../types/recipes.type';
import { RecipesService } from '../../services/recipes.service';


@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [CommonModule, RecipeItemComponent],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.scss'
})
export class RecipesListComponent {
  private recipesSubscription: Subscription | undefined;
  recipes: Recipe[] = [];
  error: Error | undefined;

  constructor(private recipesService: RecipesService) { }

  ngOnInit() {
    this.recipesSubscription = this.recipesService.getRecipes$().subscribe({
      next: (recipes) => {
        if (recipes) {
          this.recipes = recipes;
        }
      }
    });
  }

  ngOnDestroy() {
    this.recipesSubscription?.unsubscribe();
  }

}
