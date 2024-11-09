import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { switchMap, catchError, EMPTY } from 'rxjs';

interface PublicKeyResponse {
  publicKey: string;
}

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  constructor(private swPush: SwPush, private http: HttpClient) {}

  subscribeToNotifications() {
    this.http.get<PublicKeyResponse>('http://localhost:3000/api/publicKey').pipe(
      switchMap((res: PublicKeyResponse) => {
        return this.swPush.requestSubscription({
          serverPublicKey: res.publicKey
        });
      }),
      switchMap((sub: PushSubscription) =>  this.http.post('http://localhost:3000/api/subscriptions', sub)),
      catchError(err => {
        console.error('Could not subscribe to notifications', err);
        return EMPTY;
      })
    )
    .subscribe();
  }
}