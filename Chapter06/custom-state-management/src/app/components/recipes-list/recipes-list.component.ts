import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AppState, Recipe } from '../../store/recipes.types';
import { RecipesStoreService } from '../../store/state/recipes-store.service';
import { RecipesService } from '../../services/recipes.service';
import { RecipeItemComponent } from '../recipe-item/recipe-item.component';

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

  constructor(private recipeStore: RecipesStoreService, private recipesService: RecipesService) { }

  ngOnInit() {
    this.recipesService.loadRecipes();

    this.recipesSubscription = this.recipeStore
      .selectState$(
        (state: Partial<AppState>) => state.recipesState?.recipes as Partial<AppState>
      )
      .subscribe((recipes: Partial<AppState>) => {
        this.recipes = recipes as Recipe[];
      });
  }

  ngOnDestroy() {
    this.recipesSubscription?.unsubscribe();
  }

}
