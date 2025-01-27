import { Component } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { Observable, Subscription } from 'rxjs';
import { RecipeItemComponent } from '../recipe-item/recipe-item.component';
import { Recipe } from '../../types/recipes.type';
import { RecipesService } from '../../services/recipes.service';


@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [CommonModule, RecipeItemComponent, AsyncPipe, MatButton],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.scss'
})
export class RecipesListComponent {
  private recipesSubscription: Subscription | undefined;
  recipes: Recipe[] = [];
  showRetryButton$: Observable<boolean> = this.recipesService.showRetryButton$;

  constructor(private recipesService: RecipesService) { }

  ngOnInit() {
    // Retry strategy
    // this.recipesSubscription = this.recipesService.getRecipes$().subscribe({
    //   next: (recipes) => {
    //     this.recipes = recipes;
    //   }
    // });

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

  getRecipes() {
    this.recipesSubscription = this.recipesService.getRecipesWithCircuitBreakerStrategy$().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
      }
    });
  }

}
