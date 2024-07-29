import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, retry, finalize, tap } from 'rxjs';
import { NotificationService } from './notification.service';
import { Recipe } from '../types/recipes.type';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private httpClient: HttpClient, private notificationService: NotificationService) { }

  postRecipes(): void {
    this.httpClient.get<Recipe[]>('https://super-recipes.com/api/recipes').pipe(
      tap(() => {
        this.notificationService.addNotification({
          id: crypto.randomUUID(),
          message: 'Recipe added successfully.',
          type: 'success'
        });
      }),
      catchError((error) => {
        this.notificationService.addNotification({
          id: crypto.randomUUID(),
          message: 'Recipe could not be added.',
          type: 'error'
        });
        return throwError(() => new Error('Recipe could not be added.'));
      }),
    ).subscribe();
  }
}
