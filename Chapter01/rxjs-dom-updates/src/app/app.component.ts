import { Component, OnInit } from '@angular/core';
import { RecipesListComponent } from './components/recipes-list/recipes-list.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { combineLatest, debounceTime, distinctUntilChanged, distinctUntilKeyChanged, merge, mergeMap, startWith, switchMap, take, tap } from 'rxjs';
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

  searchNameFormControl = new FormControl();
  searchIngredientFormControl = new FormControl();
  recipes: Recipe[] = []

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    combineLatest({
      searchName: this.searchNameFormControl.valueChanges.pipe(startWith('')),
      searchIngredient: this.searchIngredientFormControl.valueChanges.pipe(startWith(''))
    }).pipe(
      debounceTime(500),
      distinctUntilChanged((prev, curr) => {
        return prev.searchName === curr.searchName && prev.searchIngredient === curr.searchIngredient
      }),
      switchMap(({ searchName, searchIngredient }) => 
        this.recipesService.searchRecipes$(searchName, searchIngredient)
      )
    ).subscribe((recipes) => {
      console.log('recipes', recipes);
      this.recipes = recipes;
    });
    // ])
    // this.searchNameFormControl.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(500),
    //   distinctUntilChanged(),
    //   mergeMap(searchTerm => 
    //     searchTerm ? this.recipesService.searchRecipes$(searchTerm) : this.recipesService.getRecipes$()
    //   )
    // ).subscribe((recipes) => {
    //   console.log('recipes', recipes);
    //   this.recipes = recipes;
    // });
  }
}
