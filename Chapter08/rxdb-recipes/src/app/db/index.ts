import { RxDatabase, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

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


const recipesDatabase = await createRxDatabase({
    name: 'recipesdatabase',
    storage: getRxStorageDexie()
  });

export async function getDatabase(): Promise<RxDatabase> {
    await recipesDatabase.addCollections({
      recipes: {
        schema: recipeSchema
      }
    });
  return recipesDatabase;
}