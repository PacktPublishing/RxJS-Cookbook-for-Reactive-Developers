import { Observable, map } from "rxjs";
import { ajax, AjaxResponse } from "rxjs/ajax";
import { Recipe, ResponseData, ResponseStatus } from "../types/recipes.type";

export function getRecipes$(): Observable<ResponseData<Recipe[]>> {
  return ajax<Recipe[]>("https://super-recipes.com/api/recipes").pipe(
    map((response) => ({
      status: ResponseStatus.Success,
      data: (response as AjaxResponse<Recipe[]>).response,
    }))
  );
}
