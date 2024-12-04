import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import { retryConnection } from '../operators/retry-connection.operator';

export interface Message {
  type: string;
  payload?: any;
}

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private socket$!: WebSocketSubject<Message>;
  public orders$!: Observable<Message>;

  constructor() {}

  connect() {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket<Message>({
        url: environment.wsEndpoint,
        deserializer: (e) => JSON.parse(e.data) as Message,
      });
      this.orders$ = this.socket$.multiplex(
        () => ({ subscribe: 'orders' }), // Subscription message
        () => ({ unsubscribe: 'orders' }), // Unsubscription message
        (message) => message.type === 'orders' // Filter function
      ).pipe(
        retryConnection<Message>({
          count: 5,
          delayTime: 1000,
        }),
      );
    }
  }

  sendMessage(message: Message) {
    this.socket$.next(message);
  }

  close() {
    this.socket$.complete();
  }
}
