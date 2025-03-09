import Dexie from 'dexie';

export interface Recipe {
  id?: number;
  lastUpdated: number; 
  data: {
    title: string;
    ingredients: string[];
    instructions: string;
  }
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