import { Body, Controller, Get, Post } from '@nestjs/common';
import * as webpush from 'web-push';
import { OrderStatus, orderNotification } from './notification';
import { delay, delayWhen, of, switchMap } from 'rxjs';
import { FoodOrderService } from './food-order/food-order.service';

const vapidKeys = {
  publicKey:
    'BOJNmEE3vhbWr1knoj2K8hF7ihV-OSgyKFRR3GYgdigHlrnWiO_MGGT7FfdhFbbG30FN-UFwoS6RF5uAAhc6kok',
  privateKey: 'xYuxQAMZBaIVlVM8rThlEORDVe1RMowGd6hhibxFhjE',
};
const options = {
  vapidDetails: {
    subject: 'mailto:example_email@example.com',
    publicKey: vapidKeys.publicKey,
    privateKey: vapidKeys.privateKey,
  },
};

interface NotificationSubscription {
  endpoint: string;
  expirationTime: null | number;
  keys: {
    p256dh: string;
    auth: string;
  };
}

@Controller()
export class AppController {
  constructor(private readonly foodOrderService: FoodOrderService) {}

  @Get('/api/publicKey')
  getPublicKey() {
    return { publicKey: vapidKeys.publicKey };
  }

  @Post('/api/subscriptions')
  async addSubscription(@Body() sub: NotificationSubscription) {
    return of(orderNotification[OrderStatus.ACCEPTED]).pipe(
      switchMap((notification) =>
        webpush.sendNotification(sub, JSON.stringify(notification), options),
      ),
      delayWhen(() => this.foodOrderService.processOrder()),
      switchMap(() =>
        webpush.sendNotification(
          sub,
          JSON.stringify(orderNotification[OrderStatus.COURIER_ON_THE_WAY]),
          options,
        ),
      ),
      delay(4000),
      switchMap(() =>
        webpush.sendNotification(
          sub,
          JSON.stringify(orderNotification[OrderStatus.DELIVERED]),
          options,
        ),
      ),
    );
  }
}
