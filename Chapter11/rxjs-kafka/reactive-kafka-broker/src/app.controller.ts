import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

interface Message {
  message: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('hello')
  getHello(@Body() { message }: Message): Promise<string> {
    return this.appService.getHello(message);
  }
}
