import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { Injectable } from '@angular/core';
import {
  createRxDatabase,
  RxCollection,
  RxDatabase,
} from 'rxdb';
import { NgZone } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  from,
  Observable,
} from 'rxjs';
import { map, first, tap, max } from 'rxjs/operators';

const recipeSchema = {
  title: 'recipe schema',
  description: 'describes a simple recipe',
  primaryKey: 'title',
  type: 'object',
  version: 0,
  properties: {
    title: {
      type: 'string',
      primary: true,
      maxLength: 100
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


@Injectable({ providedIn: 'root' })
export class RxDBService {
  private recipesDatabase!: any;
  private database$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private ngZone: NgZone) {
    this.initDatabase();
  }

  async initDatabase() {
    this.recipesDatabase = await createRxDatabase({
      name: 'recipesdatabase',
      storage: getRxStorageDexie()
    });
    await this.recipesDatabase.addCollections({
      recipes: {
        schema: recipeSchema
      }
    });
    this.recipesDatabase.recipes.insert({
      title: 'Spaghetti Carbonara',
      ingredients: ['spaghetti', 'eggs', 'bacon', 'parmesan cheese'],
      instructions: 'Cook spaghetti. Fry bacon. Mix eggs and cheese. Combine all ingredients.'
    });
    this.recipesDatabase.$.subscribe((changeEvent: any) => {
      debugger
      console.dir(changeEvent)
    });
  }
}