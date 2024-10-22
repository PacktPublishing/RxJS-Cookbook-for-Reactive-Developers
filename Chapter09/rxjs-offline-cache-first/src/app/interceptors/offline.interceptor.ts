import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { from, map, switchMap, withLatestFrom } from 'rxjs';

export const offlineInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const openCache$ = from(caches.open('my-app-cache'));
  const continueRequest$ = next(req).pipe(
    withLatestFrom(openCache$),
    map(([response, cache]) => {
      if (response instanceof HttpResponse) {
        cache.put(req.url, new Response(JSON.stringify(response.body)));
      }

      console.log('Network response', response);
      return response;
    }),
    // exponential backoff if request fails (check Chapter01)
  );

  return openCache$.pipe(
    switchMap((cache: Cache) => from(cache.match(req.url))),
    switchMap((cacheResponse: Response | undefined) => {
      if (cacheResponse) {
        console.log('Offline response from Cache storage', cacheResponse);
        return from(cacheResponse.json());
      }

      return continueRequest$;
    }),
    map((response: unknown) => {
      return new HttpResponse({ status: 200, body: response })
    })
  );
};
