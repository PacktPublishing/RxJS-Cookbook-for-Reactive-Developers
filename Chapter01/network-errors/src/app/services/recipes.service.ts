import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NEVER, Observable, Subject, catchError, defer, of, repeat, retry, share, shareReplay, tap, throwError, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../types/recipes.type';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  public showRetryButton$ = new Subject<boolean>();

  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar) { }

  getRecipes$(): Observable<Recipe[]> {
    return this.httpClient.get<Recipe[]>('https://super-recipes.com/api/recipes').pipe(
      catchError((error) => {
        this._snackBar.open('Recipes could not be fetched.', 'Close', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['mat-error'],
        });
        return throwError(() => new Error('Recipes could not be fetched.'));
      }),
      retry(3)
    );
  }

  getRecipesWithBackoffStrategy$(): Observable<Recipe[]> {
   return this.httpClient.get<Recipe[]>('https://super-recipes.com/api/recipes').pipe(
    catchError((error) => {
      this._snackBar.open('Recipes could not be fetched.', 'Close', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['mat-error'],
      });
      return throwError(() => new Error('Recipes could not be fetched.'));
    }),
    retry({
      count: 3,
      delay: (error, retryCount) => {
        console.log(
          `Attempt ${retryCount}: Error occurred during network request, retrying in ${Math.pow(2, retryCount)} seconds...`
        );
        return timer(Math.pow(2, retryCount) * 1000);
      },
    }),
   );
  }

  private openCircuit() {
    if (this.state === 'OPEN') return;

    this.state = 'OPEN';
    timer(15000).subscribe(() => this.halfOpenCircuit());
  }

  private halfOpenCircuit() {
    this.state = 'HALF_OPEN';
    console.log(this.state);
    this.showRetryButton$.next(true);
  }

  private closeCircuit() {
    this.state = 'CLOSED';
  }

  sendRequestIfCircuitNotOpen() {
    if (this.state === 'OPEN') {
      console.error('Circuit is open, aborting request');
      return throwError(() => new Error('Circuit is open'));
    }

    return this.httpClient.get<Recipe[]>('https://super-recipes.com/api/recipes');
  }

  getRecipesWithCircuitBreakerStrategy$(): Observable<Recipe[]> {
    return defer(() => this.sendRequestIfCircuitNotOpen()).pipe(
      catchError((error) => {
        this._snackBar.open('Recipes could not be fetched.', 'Close', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['mat-error'],
        });
        return throwError(() => new Error('Recipes could not be fetched.'));
      }),
      retry({
        count: this.state === 'HALF_OPEN' ? 1 : 3,
        delay: (error, retryCount) => {
          console.log(
            `Attempt ${retryCount}: Error occurred during network request, retrying...`
          );

          if (this.state === 'HALF_OPEN' || retryCount === 3) {
            this.openCircuit(); 
            return throwError(() => new Error('Circuit is open'));
          }

          return timer(2000);
        },
      }),
      tap(() => {
        // Successful retry, close the circuit
        this.closeCircuit(); 
        this._snackBar.dismiss();
      })
    );
  }

}
