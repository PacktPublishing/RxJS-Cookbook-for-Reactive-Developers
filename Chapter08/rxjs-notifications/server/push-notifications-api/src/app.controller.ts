import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import * as webpush from 'web-push';

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
  TTL: 60,
};
// webpush.setVapidDetails('mailto:example@yourdomain.org', vapidKeys.publicKey, vapidKeys.privateKey);

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/api/publicKey')
  getPublicKey() {
    return { publicKey: vapidKeys.publicKey };
  }

  @Post('/api/subscriptions')
  async addSubscription(@Body() sub: any) {
    const payload = {
      "notification": {
        "title": "Feedback Request",
        "body": "How was your experience? Rate your order and help us improve.",
        "actions": [
          {"action": "rate", "title": "Rate Now"}
        ],
        "data": {
          "onActionClick": {
            "default": {"operation": "openWindow", "url": "/feedback"},
            "rate": {"operation": "openWindow", "url": "/feedback"}
          }
        }
      }
    };
  
    try {
      const response = await webpush.sendNotification(sub, JSON.stringify(payload), options);
      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send notification',
        error,
      };
    }
  }
}
