// chat.component.ts
import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  messages$ = this.chatService.getMessages();

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.chatService.getMessages().subscribe(console.log);
  }

  sendMessage(msg = { event: 'message', data: { topic: 'chat', message: 'Hola!' } }) {
    this.chatService.sendChatMessage(msg);
  }
}