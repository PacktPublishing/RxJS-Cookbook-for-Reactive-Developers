import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject, filter, fromEvent, map, startWith } from 'rxjs';
import { AboutComponent } from '../components/about/about.component';
import { HomeComponent } from '../components/home/home.component';

export interface CustomRoute {
  path: string;
  component: any;
}

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  private currentRoute$ = new BehaviorSubject<CustomRoute | null>(null);
  private navigationSubject = new ReplaySubject<string>(10);

  constructor() {
    // Handle 'popstate' and 'hashchange' events
    fromEvent(window, 'popstate')
      .pipe(
        map(() => location.pathname),
        startWith(location.pathname)
      )
      .subscribe({
        next: path => {
          this.navigationSubject.next(path)
        }
      });

    // fromEvent(window, 'hashchange')
    //   .pipe(
    //     map(() => location.hash.slice(1)), // Remove the '#'
    //     startWith(location.hash.slice(1))
    //   )
    //   .subscribe(this.navigationSubject);

    // Process navigation events
    this.navigationSubject
      .pipe(
        map(path => this.matchRoute(path)),
        // filter(route => route !== null && (!route.canActivate || route.canActivate()))
      )
      .subscribe((route: CustomRoute | null) => {
        this.currentRoute$.next(route)
      });
  }

  // Simplified route matching logic
  private matchRoute(path: string): CustomRoute | null {
    // Replace this with your actual route configuration and matching logic
    const routes: CustomRoute[] = [
      { path: '/home', component: HomeComponent },
      { path: '/about', component: AboutComponent },
      // ... more routes
    ];

    return routes.find(route => route.path === path) || null;
  }

  getCurrentRoute() {
    return this.currentRoute$.asObservable();
  }

  navigate(path: string) {
    history.pushState(null, '', path);
    this.navigationSubject.next(path);
  }
}
