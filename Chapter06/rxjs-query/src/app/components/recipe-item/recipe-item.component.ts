import { Component, input } from '@angular/core';
import { Recipe } from '../../types/recipes.types';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-recipe-item',
  standalone: true,
  imports: [MatCardModule, MatChipsModule],
  templateUrl: './recipe-item.component.html',
  styleUrl: './recipe-item.component.scss'
})
export class RecipeItemComponent {
  recipe = input<Recipe>();
}
