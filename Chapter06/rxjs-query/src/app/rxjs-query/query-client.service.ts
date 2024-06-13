import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  tap,
  catchError, shareReplay, filter,
  fromEvent,
  from,
  merge,
  retry, of,
  asyncScheduler, map,
  concatMap,
  finalize,
  switchMap
} from 'rxjs';

export type QueryState<T> = {
  // status: 'isLoading' | 'success' | 'error' | 'isFetching';
  isLoading: boolean;
  isFetching: boolean;
  data?: T;
  error?: unknown;
};

type QueryOptions = {
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  staleTime?: number;
  retryNo?: number;
  gcTime?: number;
  // ... other options
};

@Injectable({
  providedIn: 'root',
})
export class QueryClientService {
  private cache = new Map<
    string,
    { state$: BehaviorSubject<any>; lastFetched: number }
  >();

  private queryTriggers(
    key: string[],
    { refetchOnWindowFocus = true, refetchOnReconnect = true }: QueryOptions,
  ): void {
    const focus$ = refetchOnWindowFocus ? fromEvent(window, 'focus') : from([]);
    const networkReconnect$ = refetchOnReconnect
      ? fromEvent(window, 'online')
      : from([]);

    merge(focus$, networkReconnect$).subscribe(() => this.refetch(key));
  }

  private query<T>(
    key: string[],
    queryFn: () => Observable<T>,
    options: QueryOptions,
  ): Observable<QueryState<T>> {
    const compositeKey = JSON.stringify(key);
    let cachedValue = this.cache.get(compositeKey) as any;
    const { staleTime = 0, retryNo = 3, gcTime = 30000 } = options;
    let { state$ } = cachedValue || {};

    if (!state$) {
      state$ = new BehaviorSubject<QueryState<T>>({
        isLoading: true,
        isFetching: true,
      });
      this.cache.set(compositeKey, { state$, lastFetched: 0 });

      this.queryTriggers(key, options);

      return state$.pipe(
        tap((state: QueryState<T>) =>
          console.log(`%cState:\n`, 'color: #ffc26e', {
            key: compositeKey,
            state,
          }),
        ),
        filter((state: QueryState<T>) => state.isFetching),
        switchMap((val) =>
          merge(
            of(val),
            queryFn().pipe(
              retry(retryNo),
              map((data) => {
                this.cache.set(compositeKey, {
                  state$,
                  lastFetched: Date.now() + staleTime,
                });
                state$.next({ data, isFetching: false, isLoading: false });

                return { data, isFetching: false, isLoading: false };
              }),
              catchError((error) =>
                of({ error, isLoading: false, isFetching: false }),
              ),
            ),
          ),
        ),
        shareReplay(1),
        finalize(() =>
          asyncScheduler.schedule(() => this.removeQuery(key), gcTime),
        ),
      );
    }

    return state$.asObservable();
  }

  public injectQuery<T>(
    queryKey: string[],
    queryFn: () => Observable<T>,
    queryOptions: QueryOptions,
  ): Observable<QueryState<T>> {
    console.log('promena', queryKey);
    return this.query<T>(queryKey, queryFn, queryOptions);
  }

  public refetch(key: string[]): void {
    const compositeKey = JSON.stringify(key);
    const cachedValue = this.cache.get(compositeKey);
    let { state$, lastFetched } = cachedValue ?? {
      state$: null,
      lastFetched: 0,
    };

    if (state$ && Date.now() > lastFetched) {
      state$.next({ ...state$.value, isFetching: true });
    }
  }

  public invalidateQuery(key: string[]): void {
    const compositeKey = JSON.stringify(key);
    const cachedValue = this.cache.get(compositeKey);
    let { state$ } = cachedValue ?? { state$: null };

    if (state$) {
      state$.next({ ...state$.value, isFetching: true });
    }
  }

  public removeQuery(key: string[]): void {
    const compositeKey = JSON.stringify(key);
    const cachedValue = this.cache.get(compositeKey);
    let { state$ } = cachedValue ?? { state$: null };

    if (state$) {
      state$.next({ isFetching: true, isLoading: true });
    }
  }
}
