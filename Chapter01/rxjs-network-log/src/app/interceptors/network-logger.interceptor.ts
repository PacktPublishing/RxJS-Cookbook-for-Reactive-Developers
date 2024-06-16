import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, finalize, startWith, tap } from 'rxjs';

export const networkLoggerInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();

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
      throw error;
    }),
    finalize(() => console.log('---------------------------------'))
  );
};
