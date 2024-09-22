import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { EMPTY, Observable, catchError, finalize, retry, tap } from 'rxjs';
import { RecipesService } from '../services/recipes.service';

export const networkLoggerInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const started = Date.now();
  const recipeService = inject(RecipesService);

  function logSuccessfulResponse(event: HttpEvent<unknown>): void {
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
    // Avoid infinite loop if analytics endpoint fails
    if (error.url !== 'https://super-recipes.com/api/analytics') {
      recipeService.errorSubject.next(error);
    }

    return EMPTY;
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
