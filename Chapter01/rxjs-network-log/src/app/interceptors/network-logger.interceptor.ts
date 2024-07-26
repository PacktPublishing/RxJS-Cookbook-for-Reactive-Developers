import {
  HttpClient,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  Observable,
  Subject,
  catchError, exhaustMap,
  finalize, of, retry, tap
} from 'rxjs';
import { RecipesService } from '../services/recipes.service';

export const networkLoggerInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();
  const httpClient = inject(HttpClient);
  const recipeService = inject(RecipesService);

  function logSuccessfulResponse(event: any) {
    if (event instanceof HttpResponse) {
      const elapsed = Date.now() - started;
      console.log(`Request took %c${elapsed} ms`, 'color: #ffc26e');
      console.log('%cResponse:', 'color: #d30b8e', event);
    }
  }

  function logFailedResponse(error: HttpErrorResponse): Observable<never> {
    const elapsed = Date.now() - started;
    console.log(
      `Request for ${req.urlWithParams} failed after %c${elapsed} ms`,
      'color: #ffc26e'
    );
    console.log('%cError:', 'color: #d30b8e', error);
    recipeService.errorSubject.next(error);

    return of();
  }

  

  return next(req).pipe(
    tap(() =>
      console.log(
        '---------------------------------',
        `\nRequest for ${req.urlWithParams} started...`
      )
    ),
    tap((event) => logSuccessfulResponse(event)),
    catchError((error) => logFailedResponse(error)),
    retry(5),
    finalize(() => console.log('---------------------------------'))
  );
};
