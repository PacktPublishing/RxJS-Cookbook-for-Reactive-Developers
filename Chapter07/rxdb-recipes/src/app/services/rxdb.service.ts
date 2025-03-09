import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { Injectable } from '@angular/core';
import { createRxDatabase, RxChangeEvent, RxDatabase, RxDocument } from 'rxdb';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  from,
  map,
  Observable,
  retry,
  shareReplay,
  Subject,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { recipeSchema } from '../schemas/recipes.schema';

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string;
}

@Injectable({ providedIn: 'root' })
export class RxDBService {
  db$: Observable<RxDatabase> = from(this.initDatabase()).pipe(
    catchError((error) => {
      console.error('Error initializing database:', error);
      return EMPTY;
    }),
    retry(3),
    shareReplay({ bufferSize: 1, refCount: true  })
  );
  recipes$ = new BehaviorSubject<Recipe[]>([]);
  addRecipe$ = new Subject<Recipe>();
  findRecipe$ = new Subject<string>();

  constructor() {
    this.addRecipe$
      .pipe(
        withLatestFrom(this.db$),
        switchMap(([recipe, db]) => db.collections['recipes'].insert(recipe)),
        catchError((error) => {
          console.error('Error inserting recipe:', error);
          return EMPTY;
        })
      )
      .subscribe();

    this.findRecipe$
      .pipe(
        withLatestFrom(this.db$),
        switchMap(
          ([recipeTitle, db]) =>
            db.collections['recipes'].find().where('title').eq(recipeTitle).$
        ),
        map((recipes: RxDocument[]) => recipes.map((r) => r.toJSON()))
      )
      .subscribe((recipes) => this.recipes$.next(recipes as Recipe[]));
  }

  async initDatabase(): Promise<RxDatabase> {
    const db = await createRxDatabase({
      name: 'recipesdatabase',
      storage: getRxStorageDexie(),
    });
    await db.addCollections({
      recipes: {
        schema: recipeSchema,
      },
    });
    // Track changes to the database
    // db.$.subscribe((changeEvent: RxChangeEvent<RxDocument>) => {
    //   console.dir(changeEvent);
    // });

    return db;
  }

  addRecipe(data: Recipe): void {
    this.addRecipe$.next(data);
  }

  findRecipe(recipeTitle: string): void {
    this.findRecipe$.next(recipeTitle);
  }
}
