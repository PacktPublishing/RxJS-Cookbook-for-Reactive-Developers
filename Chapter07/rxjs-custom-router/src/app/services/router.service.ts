import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, filter, fromEvent, map, startWith } from 'rxjs';
import { customRoutes } from '../app.routes';

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
    fromEvent(window, 'popstate')
      .pipe(
        map(() => location.pathname + location.search),
        startWith(location.pathname + location.search)
      )
      .subscribe({
        next: path => {
          this.navigationSubject.next(path)
        }
      });

    this.navigationSubject
      .pipe(
        map(path => this.matchRoute(path)),
        filter(route => route !== null)
      )
      .subscribe((route: CustomRoute | null) => {
        this.currentRoute$.next(route)
      });
  }

  private matchRoute(path: string): CustomRoute | null {
    const currentRoute = customRoutes.find(route => path.includes(route.path)) || null;

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
    const url = new URL(path, window.location.origin);

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => 
        url.searchParams.append(key, value)
      );
    }

    history.pushState(null, '', url.toString());
    this.navigationSubject.next(url.pathname + url.search);
  }

  get paramMap(): Observable<{ [key: string]: string }> {
    return this.currentRoute$.pipe(
      filter(route => route !== null),
      map(route => route?.queryParams || {}),
    );
  }

  private extractParams(path: string): { [key: string]: string } {
    const url = new URL(window.location.origin + path);
    const queryParams: { [key: string]: string } = {};
    url.searchParams.forEach((value, key) => queryParams[key] = value);

    return queryParams;
  }
}
