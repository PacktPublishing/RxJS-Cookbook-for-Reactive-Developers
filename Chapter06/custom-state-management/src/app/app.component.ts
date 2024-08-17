import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { RecipesListComponent } from './components/recipes-list/recipes-list.component';
import { RecipesStoreService } from './store/state/recipes-store.service';
import { AppState, Recipe } from './store/recipes.types';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RecipesListComponent, MatSidenavModule, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'custom-state-management';
  recipes: Recipe[] = [];

  constructor(private recipesStoreService: RecipesStoreService) {}

  handleLoadRecipes(): void {
    this.recipesStoreService
      .selectState$((state: AppState) => state.recipesState?.recipes as Partial<AppState>)
      .subscribe((recipes: Partial<AppState>) => (this.recipes = recipes as Recipe[]));
  }
}
