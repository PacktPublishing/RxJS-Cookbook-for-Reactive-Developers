import { Injectable, OnModuleInit } from '@nestjs/common';
import { BehaviorSubject, tap } from 'rxjs';
import * as WebSocket from 'ws';
import { Message } from '../chat.type';

@Injectable()
export class ChatConnectionService implements OnModuleInit {
  private clients$ = new BehaviorSubject<WebSocket[]>([]);
  private clientOneId = 'b9ec382c-a624-40ba-9865-a81be0d390a8';
  private clientTwoId = 'e1426280-0169-4647-b7d1-5e061a23a0d8';

  onModuleInit() {
    this.clients$
      .pipe(
        tap((clients: WebSocket[]) => {
          clients.forEach((client) => {
            client.send(
              JSON.stringify({
                event: 'connect',
                data: {
                  clientId: client.id,
                  name: client.id === this.clientOneId ? 'Red Panda' : 'Rocket',
                  otherClientId:
                    client.id === this.clientOneId
                      ? this.clientTwoId
                      : this.clientOneId,
                  isOnline: clients.length === 2,
                },
              }),
            );
          });
        }),
      )
      .subscribe();
  }

  getConnectedClients(): WebSocket[] {
    return this.clients$.getValue();
  }

  handleClientConnection(client: WebSocket): void {
    const clients = this.clients$.getValue();

    if (clients.length >= 2) {
      // only 2 people in chat
      client.close();
      return;
    }

    client.id = !clients.map((c: WebSocket) => c.id).includes(this.clientOneId)
      ? this.clientOneId
      : this.clientTwoId;
    this.clients$.next([...clients, client]);
  }

  handleDisconnect(client: WebSocket): void {
    const clients = this.clients$.getValue();
    this.clients$.next(clients.filter((c: WebSocket) => c.id !== client.id));
  }

  broadcastMessage(message: { event: string; data: Message[] }): void {
    const clients = this.clients$.getValue();
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}
