export const recipeSchema = {
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