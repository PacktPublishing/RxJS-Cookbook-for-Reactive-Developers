import { Injectable, OnModuleInit } from '@nestjs/common';
import { BehaviorSubject, tap } from 'rxjs';

interface CustomWebSocket extends WebSocket {
  id: string;
}

@Injectable()
export class ChatService implements OnModuleInit {
  private clients$ = new BehaviorSubject<WebSocket[]>([]);
  private clientOneId = '';
  private clientTwoId = '';

  onModuleInit() {
    this.clientOneId = crypto.randomUUID();
    this.clientTwoId = crypto.randomUUID();

    this.clients$
      .pipe(
        tap((clients: CustomWebSocket[]) => {
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

  handleClientConnection(client: CustomWebSocket): void {
    const clients = this.clients$.getValue();

    if (clients.length >= 2) {
      // only 2 people in chat
      client.close();
      return;
    }

    client.id = !clients
      .map((c: CustomWebSocket) => c.id)
      .includes(this.clientOneId)
      ? this.clientOneId
      : this.clientTwoId;
    this.clients$.next([...clients, client]);
  }

  handleDisconnect(client: CustomWebSocket): void {
    const clients = this.clients$.getValue();
    this.clients$.next(
      clients.filter((c: CustomWebSocket) => c.id !== client.id),
    );
  }
}
