import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { ChatService, Message, WsMessage } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  messages: Array<Message> = [];
  message: string = '';
  clientId: string = '';
  isTyping = false;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getClientConnection$().pipe(
      map((msg: WsMessage) => msg.data)
    ).subscribe(({ clientId, isOnline }) => {
      console.log(isOnline)
      this.clientId = clientId
    });
    this.chatService.getChatSocket$().pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    ).subscribe(({ data }: WsMessage) => {
      if ('clientId' in data) {
        this.isTyping = data.clientId !== this.clientId;
        
        return;
      }

      this.messages = data;
    });
  }

  sendMessage() {
    if (this.message.trim()) {
      this.chatService.sendChatMessage(this.message, this.clientId);
      this.message = ''; 
    }
  }

  isSender(sender: string): boolean {
    return sender === this.clientId;
  }

  handleTypeMessage(event: Event) {
    const target = event.target as HTMLInputElement;
    const { value } = target;
    this.chatService.sendIsTyping(this.clientId, value.trim().length > 0);
  }

  shouldShowTimestamp(index: number): boolean {
    return index === this.messages.length - 1 || this.messages[index].clientId !== this.messages[index + 1].clientId;
  }
}