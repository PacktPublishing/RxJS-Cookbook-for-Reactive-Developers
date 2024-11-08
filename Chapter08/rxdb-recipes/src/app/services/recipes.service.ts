import { Injectable } from '@angular/core';
import { getDatabase } from '../db';
import { RxCollection } from 'rxdb';
import { Observable, first } from 'rxjs';
import { RxDBService } from './rxdb.service';

const recipeSchema = {
  title: 'recipe schema',
  description: 'describes a simple recipe',
  primaryKey: 'id',
  type: 'object',
  version: 0,
  properties: {
    title: {
      type: 'string',
      primary: true
    },
    ingredients: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    instructions: {
      type: 'string'
    }
  },
  required: ['title', 'ingredients', 'instructions']
};

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  // private recipesCollection!: RxCollection<Recipe>;
  // private recipeCollection$: Observable<RxCollection<Recipe>>;

  constructor(private rxdbService: RxDBService) {
    // this.recipeCollection$ = this.rxdbService.getOrCreateCollection<Recipe>('recipes', recipeSchema);
    // this.recipeCollection$.subscribe(collection => {
    //   // console.log(collection)
    // }
    // )
  }

  async addRecipe(recipe: Recipe): Promise<void> {
    // const collection = await this.recipeCollection$.pipe(first()).toPromise();
    // console.log(collection)
    // await collection?.insert(recipe);
  }

  // constructor() {
  //   this.init();
  // }

  // async init() {
  //   const db = await getDatabase();
  //   this.recipesCollection = (db as any).recipes;
  //   console.log(this.recipesCollection)
  // }

  // getRecipes(): Observable<Recipe[]> {
  //   return this.recipesCollection.find().$;
  // }

  // addRecipe(recipe: Recipe) {
  //   return this.recipesCollection.insert(recipe);
  // }

  // removeRecipe(title: string) {
  //   return this.recipesCollection.findOne(title).remove();
  // }
}