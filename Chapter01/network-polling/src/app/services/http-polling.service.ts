import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Subject,
  timer,
  switchMap, takeUntil,
  retry,
  of,
  Observable,
  shareReplay, throwError, map, catchError,
  timeout
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpPollingService {
  private stopPolling$ = new Subject<void>();

  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar) {}

  startPolling<T>(url: string, interval: number = 5000): Observable<T> {
    return timer(0, interval).pipe(
      switchMap(() => this.httpClient.get<T>(url)),
      retry({
        count: 3,
        delay: (error, retryCount) => {
          console.log(
            `Attempt ${retryCount}: Error occurred during polling, retrying...`
          );
          throwError(() => new Error('Request Timeout'))
          return timer(interval);
        },
      }),
      takeUntil(this.stopPolling$),
      shareReplay(1)
    );
  }

  startLongPolling<T>(
    url: string,
    interval: number = 5000
  ): Observable<any> {
    return timer(0, interval).pipe(
      switchMap(() => this.httpClient.get<T>(url).pipe(
        timeout(interval),
      )),
      retry({
        count: 3,
        delay: (error, retryCount) => {
          console.log(
            `Attempt ${retryCount}: Error occurred during polling, retrying...`
          );
          this._snackBar.open('Retrying to establish connection...', 'Close', {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['mat-error'],
          });
          return timer(interval);
        },
      }),
      catchError(error => {
        console.error('Long polling error:', error);
        this._snackBar.open(error.message, 'Close', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['mat-error'],
        });

        return throwError(() => new Error('Request Timeout'));
      }),
      takeUntil(this.stopPolling$),
      shareReplay(1)
    );
  }

  stopPolling() {
    this.stopPolling$.next();
  }
}
