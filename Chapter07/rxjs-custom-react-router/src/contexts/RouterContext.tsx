import React from 'react';
import { Observable, fromEvent } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { useObservable } from 'observable-hooks';
import { RouteConfig } from '../types/RouteConfig.type';

interface RouterProviderProps {
  router: RouteConfig[];
  children: React.ReactNode;
}

export interface RouterContextProps {
  path$: Observable<string>;
  router: RouteConfig[];
  navigate: (path: string) => void;
}

export const RouterContext = React.createContext<RouterContextProps>({} as RouterContextProps);

export function RouterProvider({ router, children }: RouterProviderProps) {
  const path$ = useObservable(() =>
    fromEvent(window, 'popstate').pipe(
      map(() => window.location.pathname),
      startWith(window.location.pathname)
    ), ['']
  );

  function navigate(path: string, queryParams?: Record<string, string>) {
    const url = new URL(path, window.location.origin);

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) =>
        url.searchParams.append(key, value)
      );
    }

    history.pushState(null, '', url.toString());
    window.dispatchEvent(new Event('popstate'));
  }

  return (
    <RouterContext.Provider value={{ path$, router, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}