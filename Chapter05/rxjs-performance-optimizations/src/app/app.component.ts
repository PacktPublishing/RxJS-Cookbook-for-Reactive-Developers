import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  shareReplay,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import {
  measurePerformance,
  startMeasurePerformance,
} from './operators/perf-measure';
import { RecipesService } from './services/recipes.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'rxjs-performance-optimizations';
  @ViewChild('input') input!: ElementRef;
  private subscription!: Subscription;
  private destroy$ = new Subject<void>();

  constructor(private recipesService: RecipesService) { }

  ngAfterViewInit(): void {
    const input$ = fromEvent<KeyboardEvent>(this.input.nativeElement, 'input');

    // this.subscription = input$
    //   .pipe(
    //     startMeasurePerformance(),
    //     map((event: Event) => (event.target as HTMLInputElement).value),
    //     debounceTime(300),
    //     distinctUntilChanged(),
    //     filter((value) => value.trim().length > 0),
    //     switchMap((value) => this.recipesService.getRecipes$(value)),
    //     shareReplay(1),
    //     measurePerformance()
    //   )
    //   .subscribe({
    //     next: console.log,
    //   });

    input$
      .pipe(
        startMeasurePerformance(),
        map((event: Event) => (event.target as HTMLInputElement).value),
        debounceTime(300),
        distinctUntilChanged(),
        filter((value) => value.trim().length > 0),
        switchMap((value) => this.recipesService.getRecipes$(value)),
        shareReplay({ bufferSize: 1, refCount: true }),
        measurePerformance(),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: console.log,
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // this.subscription.unsubscribe();
  }
}
