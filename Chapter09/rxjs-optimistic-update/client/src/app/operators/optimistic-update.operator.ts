import { Observable, concat, of, throwError } from 'rxjs';
import { catchError, ignoreElements, retry } from 'rxjs/operators';

export function optimisticUpdate<T, E = any>(
  originalValue: T,
  rollback: (value: T, error: E) => void,
  retryConfig: { count: number; delay: number } = { count: 1, delay: 3000 }
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>) => {
    return concat(
      of(originalValue),
      source.pipe(
        ignoreElements(),
        retry(retryConfig),
        catchError((error) => {
          rollback(originalValue, error);
          return throwError(() => error);
        })
      )
    );
  };
}
