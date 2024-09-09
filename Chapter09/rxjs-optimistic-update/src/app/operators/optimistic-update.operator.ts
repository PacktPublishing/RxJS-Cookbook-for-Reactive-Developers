import { Observable, throwError, timer } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

export function optimisticUpdate<T>(
    originalValue: T,
    rollback: (value: T, error: any) => void,
  ): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => { 
      return source.pipe(
        map(() => originalValue),
        retry({
          count: 1,
          delay: () => timer(3000),
        }),
        catchError((error) => {
          rollback(originalValue, error);
          return throwError(() => error);
        })
      )
    }; 
  }