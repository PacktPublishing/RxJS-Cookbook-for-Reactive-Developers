import { Routes } from '@angular/router';
import { RecipeDetailsComponent } from './components/recipe-details/recipe-details.component';
import { RecipesListComponent } from './components/recipes-list/recipes-list.component';

export const routes: Routes = [
    { path: '', component: RecipesListComponent },
    { path: 'recipes/:id', component: RecipeDetailsComponent },
];
