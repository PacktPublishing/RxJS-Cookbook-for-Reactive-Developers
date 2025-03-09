import { Controller, Get } from '@nestjs/common';
import { AppService, Recipe } from './app.service';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/api/recipes')
  getRecipes(): Observable<Recipe[]> {
    return this.appService.getRecipes();
  }
}
