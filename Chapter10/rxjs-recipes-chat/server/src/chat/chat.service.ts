import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  filter,
  map,
  merge,
  BehaviorSubject,
  ReplaySubject,
  scan,
  shareReplay,
  distinctUntilKeyChanged,
} from 'rxjs';
import { ChatConnectionService } from './chat-connection/chat-connection.service';
import { ChatEvent, Message, WsMessage } from './chat.type';

@Injectable()
export class ChatService implements OnModuleInit {
  private topics: {
    [topicKey: string]: ReplaySubject<Message | { typing: string } | any>;
  } = {
    chat: new ReplaySubject(100),
  };
  public latestMessages$ = new BehaviorSubject<Message[]>([]);

  constructor(private chatConnectionService: ChatConnectionService) {}

  onModuleInit() {
    const chatTopic$ = this.topics['chat'].pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    const messages$ = chatTopic$.pipe(
      filter((data: WsMessage<string>) => 'message' in data),
      scan((acc, message) => [...acc, message], []),
      map((messages) => ({ event: 'chat', data: messages })),
    );

    const typing$ = chatTopic$.pipe(
      filter((data: ChatEvent) => 'isTyping' in data),
      distinctUntilKeyChanged('isTyping'),
      map(({ clientId, isTyping }: ChatEvent) => ({
        event: 'chat',
        data: { clientId, isTyping },
      })),
    );

    merge(messages$, typing$).subscribe(
      (response: { event: string; data: Message[] }) => {
        this.latestMessages$.next(response.data);
        this.chatConnectionService.broadcastMessage(response);
      },
    );
  }

  sendTopicMessage(topic: string, message: Message | ChatEvent): void {
    if (this.topics[topic]) {
      this.topics[topic].next(message);
    }
  }
}
