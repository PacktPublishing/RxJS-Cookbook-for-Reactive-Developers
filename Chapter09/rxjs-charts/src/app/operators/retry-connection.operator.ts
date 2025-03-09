import { catchError, Observable, of, OperatorFunction, retry, timer } from 'rxjs';

type TRetryOptions = {
    count: number;
    delayTime: number;
}

type TMessage = {
    type: string;
    payload?: unknown;
}

export function retryConnection<T>({ count, delayTime }: TRetryOptions): OperatorFunction<T, T | TMessage> {
  return (source: Observable<T>) =>
    source.pipe(
      retry({
        count,
        delay: (err, retryAttempt) => {
            console.error('Socket connection failed:', err);
            return timer(retryAttempt * delayTime);
        },
      }),
      catchError((err: Error) => {
        console.error('Socket connection failed:', err);
        return of({ type: 'error', payload: err } as TMessage);
      })
    );
}
