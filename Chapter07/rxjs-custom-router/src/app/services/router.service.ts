import { AuthService } from './auth.service';
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
import { customRoutes } from '../app.routes';
import { CustomRoute } from '../types/route.types';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private currentRoute$ = new BehaviorSubject<CustomRoute | null>(null);
  private navigationSubject = new ReplaySubject<string>(10);

  constructor(private authService: AuthService) {
    fromEvent(window, 'popstate')
      .pipe(
        map(() => location.pathname + location.search),
        startWith(location.pathname + location.search)
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
      customRoutes.find((route) => path.includes(route.path)) || null;

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

  get paramMap(): Observable<Map<string, string>> {
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
