import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, exhaustMap } from 'rxjs';
import { Recipe } from '../types/recipes.type';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  public errorSubject = new Subject<HttpErrorResponse>();
  
  constructor(private http: HttpClient) {
    this.errorSubject
    .pipe(
      exhaustMap((error: HttpErrorResponse) =>
        this.http.post('https://super-recipes.com/api/analytics', error)
      )
    )
    .subscribe();
  }

  getRecipes$(): Observable<Recipe[]> {
   return this.http.get<Recipe[]>('https://super-recipes.com/api/recipes');
  }
}
