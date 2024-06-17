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
    this.recipesService.connect();
    // this.recipesSubscription = this.recipesService.chatMessages$.subscribe((message) => {
    //   // this.recipes = message.payload;
    // });
    this.recipesService.sendMessage({ type: 'get_recipes', payload: {
      limit: 10,
      offset: 0
    }});
  }

  ngOnDestroy() {
    this.recipesSubscription?.unsubscribe();
    this.recipesService.close();
  }

}
