import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, AsyncPipe, MatIconModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  notifications = this.notificationService.notifications;

  constructor(private notificationService: NotificationService) {}

  removeNotification(id: string) {
    this.notificationService.removeNotification(id);
  }
}
