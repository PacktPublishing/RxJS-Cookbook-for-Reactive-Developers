import { Controller, Get } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AppService } from './app.service';

@Controller('recipes')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Observable<string> {
    return this.appService.getHello();
  }
}
