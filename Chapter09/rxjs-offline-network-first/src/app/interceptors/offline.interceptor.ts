import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { EMPTY, Observable, catchError, from, map, switchMap, withLatestFrom } from 'rxjs';

const cacheFallback = (req: HttpRequest<unknown>, openCache$: Observable<Cache>) => {
  return openCache$.pipe(
    switchMap((cache: Cache) => from(cache.match(req.url))),
    switchMap((cacheResponse: Response | undefined) => {
      if (cacheResponse) {
        return from(cacheResponse.json());
      }

      return EMPTY;
    }),
    map((response: unknown) => {
      console.log('Offline response from Cache storage', response);
      return new HttpResponse({ status: 200, body: response })
    })
  );
}

export const offlineInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const openCache$ = from(caches.open('my-app-cache'));
  const continueRequest$ = next(req);

  return continueRequest$.pipe(
    withLatestFrom(openCache$),
    map(([response, cache]) => {
      if (response instanceof HttpResponse) {
        console.log('Network hit', response.body);
        cache.put(req.url, new Response(JSON.stringify(response.body)));
      }

      return response;
    }),
    catchError(() => cacheFallback(req, openCache$))
  );
};
