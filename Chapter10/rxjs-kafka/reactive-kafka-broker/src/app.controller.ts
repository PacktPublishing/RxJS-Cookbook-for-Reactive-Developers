import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

interface Message {
  message: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('recipe')
  postRecipe(@Body() { message }: Message): Promise<string> {
    return this.appService.postRecipe(message);
  }
}
