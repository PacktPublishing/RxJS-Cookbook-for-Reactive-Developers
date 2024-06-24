import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpPollingService } from './http-polling.service';
import { Recipe } from '../types/recipes.type';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  
  constructor(private httpPollingService: HttpPollingService, private _snackBar: MatSnackBar) { }

  getRecipes$(): Observable<Recipe[]> {
   return this.httpPollingService.startLongPolling<Recipe[]>('https://super-recipes.com/api/recipes').pipe(
    catchError((error) => {
      this._snackBar.open(error.message, 'Close', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['mat-error'],
      });
      return throwError(() => new Error(error));
    }),
   );
  }
}
