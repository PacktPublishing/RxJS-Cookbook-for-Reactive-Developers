import { Component } from '@angular/core';
import { PushNotificationService } from '../../services/push-notification.service';

@Component({
  selector: 'app-food-order',
  standalone: true,
  imports: [],
  templateUrl: './food-order.component.html',
  styleUrl: './food-order.component.scss'
})
export class FoodOrderComponent {
  constructor(private pushNotifications: PushNotificationService) {}

  ngOnInit(): void {
    this.pushNotifications.subscribeToNotifications();
  }
}
