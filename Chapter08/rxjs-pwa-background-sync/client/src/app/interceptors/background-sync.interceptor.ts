import { HttpInterceptorFn } from '@angular/common/http';
import { exhaustMap, tap, timer } from 'rxjs';
import { db } from '../db/dexie.db';

export const backgroundSyncInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/recipes')) {
    console.log('Background sync request detected. Retrying request...');

    return timer(0, 5000).pipe(
      exhaustMap(() => next(req)),
      tap(async (response: any) => {
        const recipes = response.body;
        if (!Array.isArray(recipes)) return;

        for (const recipe of recipes) {
          const existingRecipe = await db.recipes.get(recipe.id);
          if (existingRecipe) {
            console.log(`Recipe with id ${recipe.id} already exists in IndexedDB.`);

            continue;
          };

          await db.recipes.add({ id: recipe.id, data: recipe });
        }
      })
    );
  }
  
  return next(req);
};
