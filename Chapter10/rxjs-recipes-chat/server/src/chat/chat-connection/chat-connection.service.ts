import { Injectable, OnModuleInit } from '@nestjs/common';
import { BehaviorSubject, tap } from 'rxjs';
import { Message } from '../chat.gateway';
import * as WebSocket from 'ws';

@Injectable()
export class ChatConnectionService implements OnModuleInit {
  private clients$ = new BehaviorSubject<WebSocket[]>([]);
  private clientOneId = '';
  private clientTwoId = '';

  onModuleInit() {
    this.clientOneId = crypto.randomUUID();
    this.clientTwoId = crypto.randomUUID();

    this.clients$
      .pipe(
        tap((clients: WebSocket[]) => {
          clients.forEach((client) => {
            client.send(
              JSON.stringify({
                event: 'connect',
                data: {
                  clientId: client.id,
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

  broadcastMessage(message: { event: string; data: Message }): void {
    const clients = this.clients$.getValue();
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
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
}
