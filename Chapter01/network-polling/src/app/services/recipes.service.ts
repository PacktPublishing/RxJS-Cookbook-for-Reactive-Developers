import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpPollingService } from './http-polling.service';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../types/recipes.type';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  
  constructor(private httpPollingService: HttpPollingService) { }

  getRecipes$(): Observable<Recipe[]> {
   return this.httpPollingService.startLongPolling<Recipe[]>('https://super-recipes.com/api/recipes');
  }
}
