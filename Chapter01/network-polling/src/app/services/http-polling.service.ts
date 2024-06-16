import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Subject,
  timer,
  switchMap,
  delay,
  takeUntil,
  retry,
  of,
  Observable,
  shareReplay,
  share,
  throwError,
  merge,
  map,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpPollingService {
  private stopPolling$ = new Subject<void>();

  constructor(private httpClient: HttpClient) {}

  startPolling<T>(url: string, interval: number = 5000): Observable<T> {
    return timer(0, interval).pipe(
      switchMap(() => this.httpClient.get<T>(url)),
      retry({
        count: 3,
        delay: (error, retryCount) => {
          console.log(
            `Attempt ${retryCount}: Error occurred during polling, retrying...`
          );
          return of(error).pipe(delay(interval));
        },
      }),
      takeUntil(this.stopPolling$),
      shareReplay(1)
    );
  }

  startLongPolling<T>(
    url: string,
    timeoutTime: number = 5000
  ): Observable<any> {
    const request$ = this.httpClient.get<T>(url, { observe: 'events' });
    const timeout$ = timer(timeoutTime);

    return merge(request$, timeout$).pipe(
      map((event: any) => {
        if (event.type === HttpEventType.Response) {
          return event.body; // New data received
        }

        if (event === 0) {
          return null; // Timeout occurred
        }
      }),
      switchMap((response) => {
        // Check if the response is null (indicating timeout)
        if (response === null) {
          return throwError(() => new Error('Request Timeout'));
        }

        return of(response); // Continue with the response if it's valid
      }),
      share()
    );
  }

  stopPolling() {
    this.stopPolling$.next();
  }
}
