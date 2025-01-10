import { Component } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { PushNotificationService } from '../../services/push-notification.service';

@Component({
  selector: 'app-food-order',
  standalone: true,
  imports: [],
  templateUrl: './food-order.component.html',
  styleUrl: './food-order.component.scss'
})
export class FoodOrderComponent {
  constructor(private pushNotifications: PushNotificationService, private swPush: SwPush) {}

  ngOnInit(): void {
    this.pushNotifications.subscribeToNotifications();
    // Listen for push messages
    this.swPush.messages.subscribe((message) => {
      console.log('Push message received', message);
    });
  }
}
