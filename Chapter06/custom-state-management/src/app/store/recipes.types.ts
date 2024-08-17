export interface Order {
    id: number;
    recipe: Recipe;
    quantity: number;
    totalCost: number;
}

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
        error: Error | null
        loading: boolean;
    }
    ordersState: {
        orders: Order[];
    }
}