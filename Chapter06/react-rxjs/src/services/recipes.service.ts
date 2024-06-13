import { Observable, catchError, map, of, startWith } from "rxjs";
import { ajax, AjaxResponse } from "rxjs/ajax";
import { shareLatest } from "@react-rxjs/core";
import { Recipe, ResponseData, ResponseStatus } from "../types/recipes.type";

export function getRecipe$(id: number): Observable<ResponseData<Recipe>> {
  return ajax<Recipe>(`https://super-recipes.com/api/recipes/${id}`).pipe(
    map((response) => ({
      status: ResponseStatus.Success,
      data: (response as AjaxResponse<Recipe>).response,
    })),
    catchError((error) => of({ status: ResponseStatus.Error, error })),
    startWith({ status: ResponseStatus.Loading }),
    shareLatest()
  );
}

export function getRecipes$(): Observable<ResponseData<Recipe[]>> {
  return ajax<Recipe[]>("https://super-recipes.com/api/recipes").pipe(
    map((response) => ({
      status: ResponseStatus.Success,
      data: (response as AjaxResponse<Recipe[]>).response,
    })),
    catchError((error) => of({ status: ResponseStatus.Error, error })),
    startWith({ status: ResponseStatus.Loading }),
    shareLatest()
  );
}
