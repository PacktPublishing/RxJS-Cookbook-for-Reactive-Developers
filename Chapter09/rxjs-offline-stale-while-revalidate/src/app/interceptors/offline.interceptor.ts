import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { EMPTY, catchError, concat, from, map, switchMap, withLatestFrom } from 'rxjs';

export const offlineInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const openCache$ = from(caches.open('my-app-cache'));
  const continueRequest$ = next(req).pipe(
    withLatestFrom(openCache$),
    map(([response, cache]) => {
      if (response instanceof HttpResponse) {
        console.log('Network hit');
        cache.put(req.url, new Response(JSON.stringify(response.body)));
      }

      return response;
    })
  );

  return concat(
    openCache$.pipe(
      switchMap((cache: Cache) => from(cache.match(req.url))),
      switchMap((cacheValue: Response | undefined) => {
        if (cacheValue) {
          console.log('Cache hit');
          return from(cacheValue.json());
        }

        return EMPTY;
      }),
      map((response: unknown) => new HttpResponse({ status: 200, body: response })),
      catchError(() => EMPTY)
    ),
    continueRequest$
  )
};
