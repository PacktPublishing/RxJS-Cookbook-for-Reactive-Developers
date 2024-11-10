import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import * as webpush from 'web-push';
import { OrderStatus, orderNotification } from './notification';
import { delay, of, switchMap } from 'rxjs';

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

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/api/publicKey')
  getPublicKey() {
    return { publicKey: vapidKeys.publicKey };
  }

  @Post('/api/subscriptions')
  async addSubscription(@Body() sub: any) {
    return of(orderNotification[OrderStatus.ACCEPTED]).pipe(
      switchMap((notification) =>  webpush.sendNotification(sub, JSON.stringify(notification), options)),
      delay(4000),
      switchMap(() =>  webpush.sendNotification(sub, JSON.stringify(orderNotification[OrderStatus.COURIER_ON_THE_WAY]), options)),
      delay(50000),
      switchMap(() =>  webpush.sendNotification(sub, JSON.stringify(orderNotification[OrderStatus.DELIVERED]), options)),
    );
  }
}
