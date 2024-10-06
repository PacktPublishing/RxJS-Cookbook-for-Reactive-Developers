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
  messages: Array<any> = [];
  clientId: string = '';
  isTyping = false;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getSocket$().pipe(
      map((msg: Message) => msg.data)
    ).subscribe(clientId => this.clientId = clientId);
    // this.messages$ = this.chatService.getMessages$();
    this.chatService.getChatSocket$().subscribe(({ data }: Message) => {
      if ('clientId' in data) {
        this.isTyping = data.clientId !== this.clientId;
        
        return;
      }

      console.log('chatMessageschatMessages', data)
      this.messages = data;
    });
    // this.chatService.getIsTyping$().subscribe((isTypingMessage: Message) => {
    //   this.isTyping = isTypingMessage.data.clientId !== this.clientId;  
    // });
  }

  sendMessage(msg = { event: 'message', data: { topic: 'chat', message: 'Hola!', clientId: this.clientId } }) {
    this.chatService.sendChatMessage(msg);
  }

  isSender(sender: string): boolean {
    return sender === this.clientId;
  }

  handleTypeMessage({ target: { value } }: any) {
    this.chatService.sendIsTyping(this.clientId, value.length > 0);
  }
}