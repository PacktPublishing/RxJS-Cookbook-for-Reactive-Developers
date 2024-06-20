import { Injectable } from '@angular/core';
import { Observable, catchError, defer, delay, delayWhen, interval, of, retry, shareReplay, tap, throwError, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../types/recipes.type';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;

  constructor(private httpClient: HttpClient) { }

  getRecipesWithBackoffStrategy$(): Observable<Recipe[]> {
   return this.httpClient.get<Recipe[]>('https://super-recipes.com/api/recipes').pipe(
    retry({
      count: 3,
      delay: (error, retryCount) => {
        console.log(
          `Attempt ${retryCount}: Error occurred during network request, retrying...`
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
    this.failureCount = 0;
  }

  private closeCircuit() {
    this.state = 'CLOSED';
    this.failureCount = 0;
  }

  getRecipesWithCircuitBreakerStrategy$(): Observable<Recipe[]> {
    return defer(() => {

      if (this.state === 'OPEN') {
        console.error('Circuit is open, aborting request');
        return throwError(() => new Error('Circuit is open'));
      }
  
      return this.httpClient.get<Recipe[]>('https://super-recipes.com/api/recipes');
    }).pipe(
      retry({
        count: this.state === 'HALF_OPEN' ? 1 : 3,
        delay: (error, retryCount) => {
          console.log(
            `Attempt ${retryCount}: Error occurred during network request, retrying...`
          );

          if (this.state === 'OPEN') {
            return throwError(() => new Error('Circuit is open'));
          }

          if (this.state === 'HALF_OPEN') {
            this.openCircuit(); 
            return throwError(() => new Error(error));
          }

          if (retryCount === 3) {
            this.openCircuit();
          }

          return timer(2000);
        },
      }),
      tap(() => {
        // Successful retry, close the circuit
        this.closeCircuit(); 
      }),
      shareReplay(1)
   );
  }

}
