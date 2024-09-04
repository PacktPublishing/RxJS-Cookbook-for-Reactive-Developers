import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { EMPTY, catchError, filter, from, map, switchMap, tap } from 'rxjs';

export const offlineInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const openCache$ = from(caches.open('my-app-cache'));
  const continueRequest$ = next(req).pipe(
    filter(
      (response: HttpEvent<unknown>): response is HttpResponse<unknown> =>
        response instanceof HttpResponse
    ),
    map(
      (response: HttpResponse<unknown>) =>
        new HttpResponse({ status: 200, body: response.body })
    )
  );

  return openCache$.pipe(
    switchMap((cache: Cache) => {
      if (!cache) {
        return continueRequest$;
      }

      return from(cache.match(req.url)).pipe(
        switchMap((cacheValue: Response | undefined) => cacheValue? cacheValue.json(): EMPTY),
        map((response: Response) => new HttpResponse({ status: 200, body: response })),
        catchError(() => {
          // No cached response found, go to network if online
          return continueRequest$.pipe(
            tap((response) =>
              cache!.put(req.url, new Response(JSON.stringify(response.body)))
            )
          );
        })
      );
    })
  );
};
