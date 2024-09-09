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
    this.recipesService.recipes.subscribe((recipes) => {  this.recipes = recipes; });
    this.recipesSubscription = this.recipesService.postRecipe().subscribe();
  }

  ngOnDestroy() {
    this.recipesSubscription?.unsubscribe();
  }

}
