import { Observable, OperatorFunction, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function tapError<T>(sideEffect: (error: any) => void): OperatorFunction<T, T> {
  return (source: Observable<T>) =>
    source.pipe(
        catchError((error: any) => {
          sideEffect(error);

          return throwError(() => error)
        })
      );
}