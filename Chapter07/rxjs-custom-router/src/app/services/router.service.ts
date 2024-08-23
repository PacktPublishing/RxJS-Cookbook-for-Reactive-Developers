import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, filter, fromEvent, map, startWith, tap } from 'rxjs';
import { AboutComponent } from '../components/about/about.component';
import { HomeComponent } from '../components/home/home.component';

export interface CustomRoute {
  path: string;
  queryParams?: { [key: string]: string };
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
        console.log('HERE Route:', route);
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
    const currentRoute = routes.find(route => path.includes(route.path)) || null;

    if (!currentRoute) {
      return null;
    }

    return {
      ...currentRoute,
      queryParams: this.extractParams(path)
    };
  }

  getCurrentRoute() {
    return this.currentRoute$.asObservable();
  }

  navigate(path: string, queryParams?: { [key: string]: string }) {
    // Construct the URL with query parameters
    const url = new URL(path, window.location.origin);
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => 
        url.searchParams.append(key, value)
      );
    }

    history.pushState(null, '', url.toString());
    this.navigationSubject.next(url.pathname + url.search); // Include query params
  }

  get paramMap(): Observable<{ [key: string]: string }> {
    return this.currentRoute$.pipe(
      tap(route => console.log(' paramMapparamMap Route:', route)),
      filter(route => route !== null), // Ensure a route is available
      map(route => this.extractParams(route!.path)) 
    );
  }

  // Helper function to extract parameters from a route path (simplified)
  private extractParams(path: string): { [key: string]: string } {
    // You'll need to implement your actual parameter extraction logic here
    // based on your route configuration (e.g., using regular expressions)
    // For this example, let's assume a simple ':id' parameter
    const url = new URL(window.location.origin + path);
    const queryParams: { [key: string]: string } = {};
    url.searchParams.forEach((value, key) => queryParams[key] = value);

    return queryParams;
  }
}
