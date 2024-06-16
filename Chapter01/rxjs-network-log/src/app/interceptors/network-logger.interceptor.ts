import {
  HttpClient,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  Subject,
  catchError, exhaustMap,
  finalize, tap
} from 'rxjs';

export const networkLoggerInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();
  const httpClient = inject(HttpClient);
  const errorSubject = new Subject<HttpErrorResponse>();

  errorSubject
    .pipe(
      exhaustMap((error: HttpErrorResponse) =>
        httpClient.post('https://super-recipes.com/api/analytics', error)
      )
    )
    .subscribe();

  return next(req).pipe(
    tap(() =>
      console.log(
        '---------------------------------',
        `\nRequest for ${req.urlWithParams} started...`
      )
    ),
    tap((event) => {
      if (event instanceof HttpResponse) {
        const elapsed = Date.now() - started;
        console.log(`Request took %c${elapsed} ms`, 'color: #ffc26e');
        console.log('%cResponse:', 'color: #d30b8e', event);
      }
    }),
    catchError((error) => {
      const elapsed = Date.now() - started;
      console.log(
        `Request for ${req.urlWithParams} failed after %c${elapsed} ms`,
        'color: #ffc26e'
      );
      console.log('%cError:', 'color: #d30b8e', error);
      errorSubject.next(error);
      throw error;
    }),
    finalize(() => console.log('---------------------------------'))
  );
};
