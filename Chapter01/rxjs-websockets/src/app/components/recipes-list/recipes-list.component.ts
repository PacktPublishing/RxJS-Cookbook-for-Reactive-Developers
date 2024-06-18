import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RecipeItemComponent } from '../recipe-item/recipe-item.component';
import { Recipe } from '../../types/recipes.type';
import { Message, RecipesService } from '../../services/recipes.service';


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
    this.recipesService.connect();
    this.recipesService.sendMessage({ type: 'recipes' });
    this.recipesSubscription = this.recipesService.recipes$.subscribe((message: Message) => {
      this.recipes = message.payload;
    });
  }

  ngOnDestroy() {
    this.recipesSubscription?.unsubscribe();
    this.recipesService.close();
  }

}
