import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { map } from 'rxjs';
import { ChatService, Message, WsMessage } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  messages: Array<Message> = [];
  clientId: string = '';
  isTyping = false;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getSocket$().pipe(
      map((msg: WsMessage) => msg.data)
    ).subscribe(clientId => this.clientId = clientId);
    this.chatService.getChatSocket$().subscribe(({ data }: WsMessage) => {
      if ('clientId' in data) {
        this.isTyping = data.clientId !== this.clientId;
        
        return;
      }

      this.messages = data;
    });
  }

  sendMessage(msg = 'Hola') {
    this.chatService.sendChatMessage(msg, this.clientId);
  }

  isSender(sender: string): boolean {
    return sender === this.clientId;
  }

  handleTypeMessage({ target: { value } }: any) {
    this.chatService.sendIsTyping(this.clientId, value.length > 0);
  }
}