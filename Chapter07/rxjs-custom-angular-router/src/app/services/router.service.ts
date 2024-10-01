import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  ReplaySubject,
  filter,
  fromEvent,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { routes } from '../app.routes';
import { CustomRoute } from '../types/route.types';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private currentRoute$ = new BehaviorSubject<CustomRoute | null>(null);
  private navigationSubject = new ReplaySubject<string>(10);

  constructor() {
    fromEvent(window, 'popstate')
      .pipe(
        map(() => window.location.pathname + window.location.search),
        startWith(window.location.pathname + window.location.search)
      )
      .subscribe({
        next: (path) => {
          this.navigationSubject.next(path);
        },
      });

    this.navigationSubject
      .pipe(
        map((path) => this.matchRoute(path)),
        switchMap((route) => {
          if (route?.canActivate) {
            return this.handleCanActivate(route);
          }

          return of(route);
        }),
        filter((route) => route !== null)
      )
      .subscribe((route: CustomRoute | null) => {
        this.currentRoute$.next(route);
      });
  }

  private handleCanActivate(
    nextRoute: CustomRoute
  ): Observable<CustomRoute | null> {
    const { path, canActivate } = nextRoute;
    const result = canActivate?.(path);

    if (!result) return EMPTY;

    return result.pipe(
      map((canActivateResult) => {        
        if (canActivateResult instanceof URL) {
          this.navigate(canActivateResult.pathname);

          return null;
        }

        if (canActivateResult) {
          return nextRoute;
        }

        return null;
      })
    );
  }

  private matchRoute(path: string): CustomRoute | null {
    const currentRoute =
      routes.find((route) => path.startsWith(route.path)) || null;

    if (!currentRoute) {
      return null;
    }

    return {
      ...currentRoute,
      queryParams: this.extractParams(path),
    };
  }

  getCurrentRoute() {
    return this.currentRoute$.asObservable();
  }

  navigate(path: string, queryParams?: Record<string, string>) {
    const url = new URL(path, window.location.origin);

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) =>
        url.searchParams.append(key, value)
      );
    }

    history.pushState(null, '', url.toString());
    this.navigationSubject.next(url.pathname + url.search);
  }

  get queryParamMap(): Observable<Map<string, string>> {
    return this.currentRoute$.pipe(
      filter((route) => route !== null),
      map((route) => route?.queryParams || new Map())
    );
  }

  private extractParams(path: string): Map<string, string> {
    const url = new URL(window.location.origin + path);
    const queryParams: Map<string, string> = new Map();
    url.searchParams.forEach((value, key) => queryParams.set(key, value));

    return queryParams;
  }
}
