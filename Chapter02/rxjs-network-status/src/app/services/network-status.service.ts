import { Injectable } from '@angular/core';
import { Observable, merge, of, fromEvent, startWith, map } from 'rxjs';

export enum ENetworkSpeed {
  SLOW = 'slow',
  FAST = 'fast'
}

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {
  slowNetworkChanges$: Observable<'slow' | 'fast'>;
  onlineChanges$: Observable<boolean>;
  isOnline: boolean = navigator.onLine;

  constructor() {
    this.onlineChanges$ = merge(
      fromEvent(window, 'online').pipe(map(() => true)), 
      fromEvent(window, 'offline').pipe(map(() => false)) 
    ).pipe(
      startWith(this.isOnline)
    ); 

    const connection = (navigator as any).connection;

    this.slowNetworkChanges$ = fromEvent(connection, 'change').pipe(
      map(() => {
        // Check for specific conditions that indicate a slow network
        // (e.g., low bandwidth, high round-trip time, etc.)
        // Return 'slow' if slow network detected, otherwise null

        if (connection.effectiveType === '2g' || connection.effectiveType === '3g') {
          return ENetworkSpeed.SLOW;
        }

        return ENetworkSpeed.FAST;
      }),
      startWith(ENetworkSpeed.FAST)
    );
  }
}
