import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeItemComponent } from '../recipe-item/recipe-item.component';
import { Recipe } from '../../types/recipes.type';


@Component({
    selector: 'app-recipes-list',
    standalone: true,
    imports: [CommonModule, RecipeItemComponent],
    templateUrl: './recipes-list.component.html',
    styleUrl: './recipes-list.component.scss'
})
export class RecipesListComponent {
 
  recipes = input<Recipe[]>();
  
}
