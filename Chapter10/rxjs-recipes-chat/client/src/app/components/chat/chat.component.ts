import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { filter, map } from 'rxjs';
import { ChatService, IChatConnection, IChatEvent, IMessage, IWsMessage } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  messages: Array<IMessage> = [];
  message: string = '';
  clientId: string = '';
  isTyping = false;
  isOnline = false;
  name = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getClientConnection$().pipe(
      map((msg: IWsMessage<IChatConnection>) => msg.data)
    ).subscribe(({ clientId, name, isOnline }) => {
      this.name = name;
      this.clientId = clientId;
      this.isOnline = isOnline;
    });
    this.chatService.getChatSocket$().pipe(
      filter(({ data }: IWsMessage<IChatEvent | IMessage[]>) => (data as IChatEvent).clientId !== this.clientId),
    ).subscribe(({ data }) => {
      if ('isTyping' in data) {
        this.isTyping = data.isTyping;

        return;
      }

      this.messages = data.map((chatMessage: IMessage) => {
        if (chatMessage.message.startsWith('data:audio')) {
          return { ...chatMessage, isVoice: true };
        }

        return chatMessage;
      });
    });
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.chatService.sendChatMessage(this.message, this.clientId);
      this.chatService.sendIsTyping(this.clientId, false);
      this.message = ''; 
    }
  }

  sendVoiceMessage(): void {
    this.chatService.sendVoiceMessage(this.clientId);
  }

  isSender(sender: string): boolean {
    return sender === this.clientId;
  }

  handleTypeMessage(value: string) {
    this.chatService.sendIsTyping(this.clientId, value.trim().length > 0);
  }

  shouldShowTimestamp(index: number): boolean {
    return index === this.messages.length - 1 || this.messages[index].clientId !== this.messages[index + 1].clientId;
  }
}