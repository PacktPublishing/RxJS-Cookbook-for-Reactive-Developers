import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ChatService, Message } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  messages$: Observable<any> | undefined;
  clientId: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getSocket$().pipe(
      map((msg: Message) => msg.data)
    ).subscribe(clientId => this.clientId = clientId);
    this.messages$ = this.chatService.getMessages$();
  }

  sendMessage(msg = { event: 'message', data: { topic: 'chat', message: 'Hola!', clientId: this.clientId } }) {
    this.chatService.sendChatMessage(msg);
  }

  isSender(sender: string): boolean {
    return sender === this.clientId;
  }
}