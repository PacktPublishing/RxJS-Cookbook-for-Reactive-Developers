import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 

import { RecipeItemComponent } from '../recipe-item/recipe-item.component';
import { Recipe } from '../../types/recipes.types';
import { QueryClientService, QueryState } from '../../rxjs-query/query-client.service';
import { RecipesService } from '../../services/recipes.service';
import { tapError } from '../../operators/tapError';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [CommonModule, RecipeItemComponent, MatProgressSpinnerModule],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.scss'
})
export class RecipesListComponent {
  private recipesSubscription: Subscription | undefined;
  queryParam = signal(1);
  queryKey = computed(() => ['recipes', this.queryParam()]);
  recipes$!: Observable<QueryState<Recipe[]>>
  
  private queryKeyEffect = effect(() => {
    // this.recipes$ = this.queryClient.injectQuery(['recipes'], () => this.recipesService.getRecipes$(), {
    //   staleTime: 1000 * 60 * 5,
    // }).pipe(tapError(console.log));
  });

  constructor(private queryClient: QueryClientService, private recipesService: RecipesService) {}

  ngOnInit(): void {
    this.recipes$ = this.queryClient.injectQuery(['recipes'], () => this.recipesService.getRecipes$(), {
      staleTime: 1000 * 5,
    }).pipe(tapError(console.log));
  }

  ngOnDestroy() {
    this.recipesSubscription?.unsubscribe();
  }

}
