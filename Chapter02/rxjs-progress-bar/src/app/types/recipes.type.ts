export enum ResponseStatus {
    Loading = 'loading',
    Success = 'success',
    Error = 'error'
}

export interface ResponseData<T> {
    status: ResponseStatus;
    data?: T;
    error?: any;
  }

export interface Recipe {
    id: number;
    name: string;
    description: string;
    ingredients: string[];
    image: string;
}

export interface RecipeDetails {
    id: number;
    prepTime: number;
    cuisine: string;
    diet: string;
    url: string;
    nutrition: {
        calories: number;
        fat: number;
        carbs: number;
        protein: number;
    };
}