import Dexie from 'dexie';

export interface Recipe {
  id?: number;
  data: any;
}

export class RecipesDB extends Dexie {
  recipes: Dexie.Table<Recipe, number>;

  constructor() {
    super('RecipesDB');
    this.version(1).stores({
      recipes: '++id'
    });
    this.recipes = this.table('recipes');
  }
}

export const db = new RecipesDB();