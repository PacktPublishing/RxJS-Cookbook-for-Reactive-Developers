import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subject,
  filter,
  tap,
  switchMap,
  catchError,
  of,
  finalize,
  shareReplay,
  takeUntil, delay,
  startWith
} from 'rxjs';
import { TabContentComponent } from '../tab-content/tab-content.component';
import { TabContent2Component } from '../tab-content2/tab-content2.component';

interface TabConfig {
  index: number;
  label: string;
  route: string;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, TabContentComponent, RouterModule, MatTabsModule, MatProgressSpinnerModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  private destroy$ = new Subject<void>();
  tabs: TabConfig[] = [
    { index: 0, label: 'Recipe 1', route: 'tab1' },
    { index: 1, label: 'Recipe 2', route: 'tab2' },
  ];

  activeTab$ = new BehaviorSubject<TabConfig | null>(null);
  activeTabContent$!: Observable<any>;
  loadingTab$ = new BehaviorSubject<boolean>(false);
  errors$ = new Subject<Error>();
  private cache = new Map<string, any>();

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          const activeTab = this.tabs.find(
            (tab) => tab.route === this.router.url.slice(1)
          );
          this.activeTab$.next(activeTab || null);
        },
      });

    this.activeTabContent$ = this.activeTab$.pipe(
      filter((tab) => !!tab),
      tap(() => this.loadingTab$.next(true)),
      switchMap((tab) =>
        this.loadTabContent(tab!).pipe(
          startWith(null),
          catchError((error) => {
            this.errors$.next(error);
            return of(null);
          }),
          finalize(() => this.loadingTab$.next(false))
        )
      ),
      shareReplay(1)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTabContent(tab: TabConfig): Observable<any> {
    if (this.cache.has(tab.route)) {
      return this.cache.get(tab.route)!;
    }

    const content$ =
      tab.route === 'tab1' ? of(TabContentComponent) : of(TabContent2Component);
    this.cache.set(tab.route, content$);

    return content$.pipe(delay(1000));
  }

  public selectTab(tab: MatTabChangeEvent): void {
    const navigateTab = this.tabs.find((t) => t.index === tab.index);
    this.router.navigate([navigateTab!.route]);
  }
}
