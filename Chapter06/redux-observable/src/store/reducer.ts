// recipesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe, ResponseData } from '../types/recipes.type';

export interface RecipesState {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
}

const initialState: RecipesState = {
  recipes: [],
  selectedRecipe: null,
  loading: false,
  error: null,
};

export const recipesSlice = createSlice({
  name: 'recipesState',
  initialState,
  reducers: {
    fetchRecipes: state => {
      state.loading = true;
      state.error = null;
    },
    fetchRecipesSuccess: (state, action: PayloadAction<ResponseData<Recipe[]>>) => {
      state.recipes = (action.payload as ResponseData<Recipe[]>).data || [];
      state.loading = false;
    },
    fetchRecipesError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    fetchRecipeSuccess: (state, action: PayloadAction<Recipe>) => {
      state.selectedRecipe = action.payload;
    },
  },
});

export const { fetchRecipes, fetchRecipesSuccess, fetchRecipesError, fetchRecipeSuccess } = recipesSlice.actions;

export default recipesSlice.reducer;