import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, delay, map, Observable, of, ReplaySubject, retry, scan } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

export interface IWsMessage<T> {
  event: string;
  data: T;
}

export interface IMessage {
  id?: string;
  message: string;
  clientId: string;
  timestamp?: Date;
  topic: string;
}

export interface IChatEvent {
  clientId: string;
  isTyping: boolean;
}

export interface IChatConnection {
  clientId: string;
  name: string;
  otherClientId: string;
  isOnline: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket$!: WebSocketSubject<IWsMessage<any>>;
  private socketOfflineMessages$ = new ReplaySubject<IWsMessage<IMessage>>(100);
  public chat$!: Observable<IWsMessage<IMessage[]>>;
  public clientConnection$!: Observable<IWsMessage<IChatConnection>>;
  public isTyping$!: Observable<IWsMessage<IChatEvent>>;

  constructor() {
    this.connect();
  }

  connect() {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket<IWsMessage<IMessage>>({
        url: 'ws://localhost:8080',
        deserializer: (e) => JSON.parse(e.data) as IWsMessage<IMessage>,
        openObserver: {
          next: () => {
            this.socketOfflineMessages$.subscribe((message: IWsMessage<IMessage>) => {
              this.socket$.next(message);
            });
          },
        },
      });
      this.clientConnection$ = this.socket$.multiplex(
        () => ({ subscribe: 'connect' }), 
        () => ({ unsubscribe: 'connect' }), 
        (message) => message.event === 'connect'
      );
      this.chat$ = this.socket$.multiplex(
        () => ({ subscribe: 'chat' }), 
        () => ({ unsubscribe: 'chat' }), 
        (message) => message.event === 'chat'
      );
      this.isTyping$ = this.socket$.multiplex(
        () => ({ subscribe: 'typing' }), 
        () => ({ unsubscribe: 'typing' }), 
        (message) => message.event === 'typing'
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
          this.socket$.unsubscribe();
          return of(null);
        })
      )
      .subscribe();
  }

  sendChatMessage(message: string, clientId: string) {
    if (this.socket$.closed) {
      this.socketOfflineMessages$.next({ event: 'message', data: { topic: 'chat', message, clientId }});
      this.connect();

      return;
    }

    this.socket$.next({ event: 'message', data: { topic: 'chat', message, clientId }});
  }

  
  sendIsTyping(clientId: string, isTyping: boolean = true) {
    this.socket$.next({ event: 'typing', data: { topic: 'chat', clientId, isTyping } });
  }
  
  getClientConnection$(): Observable<IWsMessage<IChatConnection>> {
    return this.clientConnection$;
  }
  
  getChatSocket$(): Observable<IWsMessage<IMessage[]>> {
    return this.chat$;
  }
  
  getIsTyping$(): Observable<IWsMessage<IChatEvent>> {
    return this.isTyping$;
  }
}
// sendVoiceMessage(clientId: string) {
//   const constraints = { audio: true };
//   navigator.mediaDevices.getUserMedia(constraints)
//     .then((stream) => {
//       const mediaRecorder = new MediaRecorder(stream);
//       const audioChunks: BlobPart[] = [];

//       mediaRecorder.ondataavailable = (event) => {
//         audioChunks.push(event.data);
//       };

//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//         const reader = new FileReader();
//         reader.readAsDataURL(audioBlob);
//         reader.onloadend = () => {
//           const base64AudioMessage = reader.result as string;
//           this.socket$.next({ event: 'voice', data: { topic: 'chat', clientId, message: base64AudioMessage } });
//         };
//       };

//       mediaRecorder.start();

//       setTimeout(() => {
//         mediaRecorder.stop();
//       }, 5000); // Record for 5 seconds
//     })
//     .catch((error) => {
//       console.error('Error accessing media devices.', error);
//     });
// }