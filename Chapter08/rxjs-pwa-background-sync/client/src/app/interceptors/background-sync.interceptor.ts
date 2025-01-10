import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, concatMap, EMPTY, exhaustMap, switchMap, take, tap, timer } from 'rxjs';
import { db } from '../db/dexie.db';

interface RecipeResponse {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string;
}

export const backgroundSyncInterceptor: HttpInterceptorFn = (req, next): any => {
  if (req.url.includes('/recipes')) {
    return timer(0, 5000).pipe(
      take(5),
      exhaustMap(() => next(req)),
      switchMap((response) => {
        if (response instanceof HttpResponse) {
          return response.body as RecipeResponse[];
        }

        return EMPTY;
      }),
      concatMap(async ({ id, ...data }: RecipeResponse) => {
        const existingRecipe = await db.recipes.get(id)

        if (existingRecipe) {
          console.log(`Recipe with id ${id} already exists in IndexedDB.`);

          return EMPTY;
        }

        return db.recipes.add({ id, data, lastUpdated: new Date() });
      }),
      catchError((error) => {
        console.error('Error while syncing data:', error);

        return EMPTY;
      })
    );
  }
  
  return next(req);
};
