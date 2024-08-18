import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import {
  catchError,
  delay,
  filter,
  Observable,
  of,
  retry,
  switchMap,
  takeWhile,
  tap,
  timeout,
  timer,
} from 'rxjs';

export interface Message {
  type: string;
  payload?: any;
}

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private socket$!: WebSocketSubject<Message>;
  public recipes$!: Observable<Message>;
  // public chatMessages$ = this.socket$.pipe(filter(msg => msg.type === 'chat'));
  // public notificationMessages$ = this.socket$.pipe(filter(msg => msg.type === 'notification'));

  constructor() {}

  connect() {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket<Message>({
        url: environment.wsEndpoint,
        deserializer: (e) => JSON.parse(e.data) as Message,
      });
      this.recipes$ = this.socket$.multiplex(
        () => ({ subscribe: 'recipes' }), // Subscription message
        () => ({ unsubscribe: 'recipes' }), // Unsubscription message
        (message) => message.type === 'recipes' // Filter function
      );
    }

    this.socket$
      .pipe(
        retry({
          count: 1,
          delay: (error, retryCount) => {
            console.log(
              `Attempt ${retryCount}: Error occurred during websocket connection, retrying...`
            );
            return of(error).pipe(delay(1000));
          },
        }),
        catchError((err) => {
          console.error('Error occurred during websocket connection:', err);
          this.sendHeartbeat();
          return of(null);
        })
      )
      .subscribe();
  }

  sendHeartbeat() {
    timer(2000)
      .pipe(
        tap(() => this.sendMessage({ type: 'heartbeat' })),
        switchMap(() =>
          this.socket$.pipe(
            filter((msg) => msg.type === 'heartbeat'),
            timeout(5000 * 2), // Allow double the heartbeat interval for response

            catchError(() => {
              console.error('Heartbeat timeout, closing connection');
              this.close();
              return of(null); // Return null to stop retry attempts after closing
            })
          )
        ),
        takeWhile(() => this.socket$.observed)
      )
      .subscribe();
  }

  sendMessage(message: Message) {
    this.socket$.next(message);
  }

  close() {
    this.socket$.unsubscribe();
  }
}
