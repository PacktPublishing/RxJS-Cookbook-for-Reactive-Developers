import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket$ = webSocket('ws://localhost:3000/');

  public connect(url: string): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket({
        url,
        deserializer: (e) => JSON.parse(e.data)
      });
    }
  }

  public send(message: any): void {
    this.socket$.next(message);
  }

  public close(): void {
    this.socket$.complete();
  }

  public get messages$() {
    return this.socket$.asObservable();
  }
  
}
