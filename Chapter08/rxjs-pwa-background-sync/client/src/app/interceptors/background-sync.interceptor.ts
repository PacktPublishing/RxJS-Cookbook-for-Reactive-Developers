import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, concatMap, EMPTY, exhaustMap, switchMap, take, timer } from 'rxjs';
import { db } from '../db/dexie.db';

interface RecipeResponse {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string;
  timestamp: number;
}

export const backgroundSyncInterceptor: HttpInterceptorFn = (req, next): any => {
  if (req.url.includes('/recipes')) {
    return timer(2000, 5000).pipe(
      take(15),
      exhaustMap(() => next(req)),
      switchMap((response) => {
        if (response instanceof HttpResponse) {
          return response.body as RecipeResponse[];
        }

        return EMPTY;
      }),
      concatMap(async ({ id, ...data }: RecipeResponse) => {
        const existingRecipe = await db.recipes.get(id);
        const isRecipeStale = existingRecipe && existingRecipe.lastUpdated < data.timestamp;

        if (!existingRecipe) {
          console.log(`Adding recipe with id ${id} in IndexedDB.`);
          return db.recipes.add({ id, data, lastUpdated: data.timestamp });
        }

        if (isRecipeStale) {
          console.log(`Updating recipe with id ${id} in IndexedDB.`);
          return db.recipes.update(id, { data, lastUpdated: data.timestamp });
        }
        console.log(`Recipe with id ${id} already exists in IndexedDB.`);

        return EMPTY;
      }),
      catchError((error) => {
        console.error('Error while syncing data:', error);

        return EMPTY;
      })
    );
  }
  
  return next(req);
};
