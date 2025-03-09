import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { EMPTY, NEVER, Observable, catchError, delay, filter, from, map, of, race, raceWith, switchMap, tap, withLatestFrom } from 'rxjs';

export const offlineInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  let dataFromCache$: Observable<HttpEvent<unknown>>;
  let continueRequestWithCacheSave$: Observable<HttpEvent<unknown>>;

  const openCache$ = from(caches.open('my-app-cache'));
  dataFromCache$ = openCache$.pipe(
    delay(4000),
    switchMap((cache: Cache) => from(cache.match(req.url))),
    switchMap((cacheResponse: Response | undefined) => {
      if (cacheResponse) {
        return from(cacheResponse.json());
      }

      return NEVER;
    }),
    map((response: unknown) => {
      console.log('Offline response from Cache storage', response);
      return new HttpResponse({ status: 200, body: response })
    }),
  );
  continueRequestWithCacheSave$ = next(req).pipe(
    withLatestFrom(openCache$),
    map(([response, cache]) => {
      if (response instanceof HttpResponse) {
        console.log('Online response from Network', response);
        cache.put(req.url, new Response(JSON.stringify(response.body)));
      }

      return response;
    }),
    catchError(() => dataFromCache$),
  );

  return dataFromCache$.pipe(
    raceWith(continueRequestWithCacheSave$)
  );
  
};
