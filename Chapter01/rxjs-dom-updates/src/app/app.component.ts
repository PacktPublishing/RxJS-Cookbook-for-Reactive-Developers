import { Component, OnInit } from '@angular/core';
import { RecipesListComponent } from './components/recipes-list/recipes-list.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, switchMap } from 'rxjs';
import { RecipesService } from './services/recipes.service';
import { Recipe } from './types/recipes.type';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RecipesListComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'rxjs-dom-updates';

  searchFormControl = new FormControl();
  recipes: Recipe[] = []

  get searchFormControlValue() {
    return this.searchFormControl.getRawValue();
  }

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    this.searchFormControl.valueChanges.pipe(
      debounceTime(500),
      switchMap(searchTerm => this.recipesService.searchRecipes$(searchTerm))
    ).subscribe((recipes) => {
      console.log('Search value changed:', recipes);
      this.recipes = recipes;
    });
  }
}
