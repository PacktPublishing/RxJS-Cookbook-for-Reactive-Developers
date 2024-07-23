import { Observable } from "rxjs";
import { ajax, AjaxResponse } from "rxjs/ajax";
import { Recipe } from "../types/recipes.type";

export function getRecipe$(id: number): Observable<AjaxResponse<Recipe>> {
  return ajax<Recipe>(`https://super-recipes.com/api/recipes/${id}`);
}

export function getRecipes$(): Observable<AjaxResponse<Recipe[]>> {
  return ajax<Recipe[]>("https://super-recipes.com/api/recipes");
}
