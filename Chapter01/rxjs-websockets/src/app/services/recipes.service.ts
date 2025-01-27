import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {
  catchError,
  delay,
  EMPTY,
  filter,
  Observable,
  of,
  retry,
  switchMap,
  tap,
  timeout,
  timer,
} from 'rxjs';
import { Recipe } from '../types/recipes.type';
import { environment } from '../../environments/environment';

export interface Message<T> {
  type: string;
  payload?: T;
}

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private socket$!: WebSocketSubject<Message<any>>;
  public recipes$!: Observable<Message<Recipe[]>>;
  // public chatMessages$ = this.socket$.pipe(filter(msg => msg.type === 'chat'));
  // public notificationMessages$ = this.socket$.pipe(filter(msg => msg.type === 'notification'));

  constructor(private _snackBar: MatSnackBar) {}

  connect() {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket<Message<any>>({
        url: environment.wsEndpoint,
        deserializer: (e) => JSON.parse(e.data) as Message<any>,
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
    timer(0, 5000)
      .pipe(
        tap(() => this.sendMessage({ type: 'heartbeat' })),
        switchMap(() =>
          this.socket$.pipe(
            filter((msg) => msg.type === 'heartbeat'),
            timeout(5000 * 2), // Allow double the heartbeat interval for response

            catchError(() => {
              console.error('Heartbeat timeout, closing connection');
              this.close();
              this._snackBar.open('Lost connection to the WebSocket.', 'Close', {
                verticalPosition: 'top',
                horizontalPosition: 'right',
                panelClass: ['mat-error'],
              });
              return EMPTY; // Return EMPTY to stop retry attempts after closing
            })
          )
        ),
        tap(() => this._snackBar.dismiss())
      )
      .subscribe();
  }

  sendMessage(message: Message<Recipe[]>) {
    this.socket$.next(message);
  }

  close() {
    this.socket$.unsubscribe();
  }
}
