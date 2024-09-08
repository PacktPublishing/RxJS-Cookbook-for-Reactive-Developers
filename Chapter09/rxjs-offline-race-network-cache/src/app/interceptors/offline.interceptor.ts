import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { EMPTY, Observable, catchError, delay, from, map, raceWith, switchMap, withLatestFrom } from 'rxjs';

export const offlineInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  let dataFromCache$: Observable<HttpEvent<unknown>>;
  let continueRequestWithCacheSave$: Observable<HttpEvent<unknown>>;

  const openCache$ = from(caches.open('my-app-cache'));
  dataFromCache$ = openCache$.pipe(
    switchMap((cache: Cache) => from(cache.match(req.url))),
    switchMap((cacheValue: Response | undefined) => {
      if (cacheValue) {
        console.log('Cache hit');
        return from(cacheValue.json());
      }

      return EMPTY;
    }),
    map((response: unknown) => {
      console.log('Offline response from Cache storage', response);
      return new HttpResponse({ status: 200, body: response })
    }),
    catchError(() => continueRequestWithCacheSave$),
  );
  continueRequestWithCacheSave$ = next(req).pipe(
    delay(5000),
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

  return continueRequestWithCacheSave$.pipe(
    raceWith(dataFromCache$),
  );
  
};
