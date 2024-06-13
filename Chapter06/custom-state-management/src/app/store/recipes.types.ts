export interface Recipe {
    id: number;
    name: string;
    description: string;
    ingredients: string[];
    image: string;
}

export interface AppState {
    recipesState: {
        recipes: Recipe[];
        selectedRecipe: Recipe | null;
        error: null
        loading: boolean;
    }
    ordersState: {
        orders: Recipe[];
    }
}