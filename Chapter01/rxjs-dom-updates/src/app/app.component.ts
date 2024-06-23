import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RecipesListComponent } from './components/recipes-list/recipes-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  startWith,
  switchMap,
} from 'rxjs';
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
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  title = 'rxjs-dom-updates';
  recipes: Recipe[] = [];

  @ViewChild('searchNameInput') searchNameInputElement!: ElementRef;
  @ViewChild('searchIngredientInput') searchIngredientInputElement!: ElementRef;

  constructor(private recipesService: RecipesService) {}

  ngAfterViewInit(): void {
    combineLatest({
      searchName: fromEvent<InputEvent>(
        this.searchNameInputElement.nativeElement,
        'input'
      ).pipe(
        map(
          (searchInput: InputEvent) =>
            (searchInput.target as HTMLInputElement).value
        ),
        startWith('')
      ),
      searchIngredient: fromEvent<InputEvent>(
        this.searchIngredientInputElement.nativeElement,
        'input'
      ).pipe(
        map(
          (searchInput: InputEvent) =>
            (searchInput.target as HTMLInputElement).value
        ),
        startWith('')
      ),
    })
      .pipe(
        debounceTime(500),
        distinctUntilChanged((prev, curr) => {
          return (
            prev.searchName === curr.searchName &&
            prev.searchIngredient === curr.searchIngredient
          );
        }),
        switchMap(({ searchName, searchIngredient }) =>
          this.recipesService.searchRecipes$(searchName, searchIngredient)
        )
      )
      .subscribe((recipes) => {
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
