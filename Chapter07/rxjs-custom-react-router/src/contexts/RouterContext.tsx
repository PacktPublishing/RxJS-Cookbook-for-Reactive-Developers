import React from 'react';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { useObservable, useSubscription } from 'observable-hooks';
import HomePage from '../components/HomePage';
import AboutPage from '../components/AboutPage';

export const routeConfig = [
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/about/:id',
    element: <AboutPage />,
  },
];

export const RouterContext = React.createContext<any>(null);
export const navigationSubject = new BehaviorSubject(window.location.pathname);

export function RouterProvider({ children }: React.PropsWithChildren<{}>) {

  const path$ = useObservable(() =>
    fromEvent(window, 'popstate').pipe(
      map(() => window.location.pathname + location.search),
      startWith(window.location.pathname + location.search)
    )
  );

  useSubscription(path$, (path) => {
    const matchedRoute = matchRoute(path);
    if (matchedRoute) {
      navigationSubject.next(matchedRoute.path);
    }
  });

  function navigate(path: string, queryParams?: { [key: string]: string }) {
    const url = new URL(path, window.location.origin);

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) =>
        url.searchParams.append(key, value)
      );
    }

    history.pushState(null, '', url.toString());
    window.dispatchEvent(new Event('popstate'));
    navigationSubject.next(url.pathname + url.search);
  }

  function matchRoute(path: string) {
    return routeConfig.find((route) => path.split('/')[1].includes(route.path)) || null;
  }

  return (
    <RouterContext.Provider value={{ path$, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}