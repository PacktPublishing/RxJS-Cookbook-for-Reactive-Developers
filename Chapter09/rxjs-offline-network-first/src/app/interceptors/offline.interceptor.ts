import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { catchError, from, map, switchMap, withLatestFrom } from 'rxjs';

export const offlineInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const openCache$ = from(caches.open('my-app-cache'));
  const continueRequest$ = next(req);

  return continueRequest$.pipe(
    withLatestFrom(openCache$),
    map(([response, cache]) => {
      if (response instanceof HttpResponse) {
        cache.put(req.url, new Response(JSON.stringify(response.body)));
      }

      return response;
    }),
    catchError(() => {
      return openCache$.pipe(
        switchMap((cache: Cache) => from(cache.match(req.url))),
        switchMap((cacheValue: any) => cacheValue.json()),
        map((response: unknown) => {
          console.log('Offline response from Cache storage', response);
          return new HttpResponse({ status: 200, body: response })
        })
      );
    })
  );
};
