import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PushNotificationService } from './services/push-notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rxjs-notifications';

  constructor(private pushNotifications: PushNotificationService) {}

  ngOnInit(): void {
    this.pushNotifications.subscribeToNotifications();
  }
}
