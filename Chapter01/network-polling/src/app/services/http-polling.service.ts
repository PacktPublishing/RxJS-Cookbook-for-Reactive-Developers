import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Subject,
  timer,
  switchMap, delay, takeUntil,
  retry,
  of,
  Observable,
  shareReplay
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpPollingService {
  private stopPolling$ = new Subject<void>();

  constructor(private httpClient: HttpClient) {}

  startPolling<T>(url: string, interval: number = 5000): Observable<T> {
    return timer(0, interval)
      .pipe(
        switchMap(() => this.httpClient.get<T>(url)),
        retry({
          count: 3,
          delay: (error, retryCount) => {
            console.log(`Attempt ${retryCount}: Error occurred during polling, retrying...`);
            return of(error).pipe(delay(interval)); 
          }
        }),
        takeUntil(this.stopPolling$),
        shareReplay(1)
      );     
  }

  stopPolling() {
    this.stopPolling$.next();
  }
}
