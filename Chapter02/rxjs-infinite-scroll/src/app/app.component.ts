import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  fromEvent,
  map,
  filter,
  distinctUntilChanged,
  merge,
  switchMap,
  Subject,
  takeUntil,
  finalize,
  BehaviorSubject,
  tap,
  startWith,
  throttleTime,
  auditTime,
  observeOn,
  animationFrameScheduler,
} from 'rxjs';
import { RecipesService } from './services/recipes.service';
import { RecipesListComponent } from './components/recipes-list/recipes-list.component';
import { Recipe } from './types/recipes.type';
import { NewRecipesComponent } from './components/new-recipes/new-recipes.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RecipesListComponent, MatProgressSpinnerModule, AsyncPipe, NewRecipesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private page = 0;
  public loading$ = new BehaviorSubject<boolean>(false);
  public noMoreData$ = new Subject<void>();
  private destroy$ = new Subject<void>();
  recipes: Recipe[] = [];
  
  constructor(private recipesService: RecipesService) {}

  private isNearBottom(): boolean {
    const threshold = 100; // Pixels from bottom
    const position = window.innerHeight + window.scrollY;
    const height = document.documentElement.scrollHeight;

    return position > height - threshold;
  }

  ngOnInit() {
    const scrollEvent$ = fromEvent(window, 'scroll');

    scrollEvent$
      .pipe(
        startWith(null),
        auditTime(50), // Prevent excessive event triggering
        observeOn(animationFrameScheduler),
        map(() => this.isNearBottom()),
        distinctUntilChanged(), // Emit only when near-bottom state changes
        filter((isNearBottom) => isNearBottom && !this.loading$.value),
        tap(() => this.loading$.next(true)),
        switchMap(() =>
          this.recipesService
            .getRecipes(++this.page)
            .pipe(
              tap((recipes) => {
                if (recipes.length === 0) this.noMoreData$.next();
              }),
              finalize(() => this.loading$.next(false))
            )
        ),
        takeUntil(merge(this.destroy$, this.noMoreData$))
      )
      .subscribe((recipes) => (this.recipes = [...this.recipes, ...recipes]));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refreshAndScrollToTop() {
    this.page = 1;
    this.recipes = [];
    this.loading$.next(true);
    this.noMoreData$.complete();
    window.scrollTo(0, 0);
    this.recipesService.getRecipes(this.page).subscribe((recipes) => {
      this.loading$.next(false);
      this.recipes = recipes;
    });
  }
}
