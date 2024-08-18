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

  constructor(private recipesService: RecipesService) { }

  ngOnInit() {
    // Exponential back off strategy
    // this.recipesSubscription = this.recipesService.getRecipesWithBackoffStrategy$().subscribe({
    //   next: (recipes) => {
    //     this.recipes = recipes;
    //   }
    // });

    // Circuit breaker strategy
    this.recipesSubscription = this.recipesService.getRecipesWithCircuitBreakerStrategy$().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
      }
    });
  }

  ngOnDestroy() {
    this.recipesSubscription?.unsubscribe();
  }

}
