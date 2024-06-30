import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  takeUntil,
  timer,
  map,
  from,
  delay,
  startWith,
  repeat,
} from 'rxjs';
import { TabContentComponent } from '../tab-content/tab-content.component';
import { TabContent2Component } from '../tab-content2/tab-content2.component';

interface TabConfig {
  label: string;
  route: string;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, TabContentComponent, RouterModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  tabs: TabConfig[] = [
    { label: 'Tab 1', route: 'tab1' },
    { label: 'Tab 2', route: 'tab2' },
  ];
  private destroy$ = new Subject<void>();

  activeTab$ = new BehaviorSubject<TabConfig | null>(null);
  activeTabContent$!: Observable<any>;
  loadingTab$ = new BehaviorSubject<boolean>(false);
  errors$ = new Subject<Error>();
  private cache = new Map<string, any>();

  constructor(private router: Router) {}

  ngOnInit() {
    this.activeTabContent$ = this.activeTab$.pipe(
      filter((tab) => !!tab),
      tap(() => this.loadingTab$.next(true)),
      switchMap((tab) => this.loadTabContent(tab!).pipe(
        catchError((error) => {
          this.errors$.next(error);
          return of(null);
        }),
        finalize(() => this.loadingTab$.next(false)),
      )),
      // shareReplay(1)
    );

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

    // Auto-activate first tab after a short delay to ensure navigation is ready
    timer(100).subscribe(() => this.selectTab(this.tabs[0]));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectTab(tab: TabConfig) {
    this.router.navigate([tab.route]);
  }

  private loadTabContent(tab: TabConfig): Observable<any> {
    if (this.cache.has(tab.route)) {
      return this.cache.get(tab.route)!;
    }

    const content$ =
      tab.route === 'tab1' ? of(TabContentComponent) : of(TabContent2Component);
    this.cache.set(tab.route, content$);

    return content$.pipe(
      delay(1000)
    );
  }
}
