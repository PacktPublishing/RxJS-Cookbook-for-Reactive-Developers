import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { EMPTY, concat, from, map, switchMap, withLatestFrom } from 'rxjs';

export const offlineInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const openCache$ = from(caches.open('my-app-cache'));
  const dataFromCache$ = openCache$.pipe(
    switchMap((cache: Cache) => from(cache.match(req.url))),
    switchMap((cacheResponse: Response | undefined) => {
      if (cacheResponse) {
        console.log('Cache hit');
        return from(cacheResponse.json());
      }

      return EMPTY;
    }),
    map((response: unknown) => new HttpResponse({ status: 200, body: response })),
    // exponential backoff if request fails (check Chapter01)
  );
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
    dataFromCache$,
    continueRequest$
  );
};
