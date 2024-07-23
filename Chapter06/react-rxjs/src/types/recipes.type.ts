export enum ResponseStatus {
    LOADING = 'loading',
    SUCCESS = 'success',
    ERROR = 'error'
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