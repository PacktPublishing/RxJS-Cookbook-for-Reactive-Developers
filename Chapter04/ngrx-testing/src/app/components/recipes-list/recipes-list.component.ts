import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { RecipeItemComponent } from '../recipe-item/recipe-item.component';
import { Recipe } from '../../reducers/recipes.types';
import { loadRecipesAction } from '../../reducers/recipes.actions';
import * as fromRecipes from '../../reducers/recipes.selector';
import { selectCurrentRoute } from '../../reducers/recipes.selector';

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

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(loadRecipesAction());

    this.store.pipe(select(fromRecipes.selectRecipesWithCurrentRoute)).subscribe(({ recipesState: { recipes }, routerState }) => {
      this.recipes = recipes;
    });
  }

  ngOnDestroy() {
    this.recipesSubscription?.unsubscribe();
  }

}
