import { bind, shareLatest } from "@react-rxjs/core";
import { getRecipe$, getRecipes$ } from "../services/recipes.service";
import { catchError, map, of, startWith, switchMap } from "rxjs";
import { createSignal } from "@react-rxjs/utils";
import { AjaxResponse } from "rxjs/ajax";
import { ResponseStatus, Recipe, ResponseData } from "../types/recipes.type";

export const [useRecipes, recipes$] = bind<ResponseData<Recipe[]>>(getRecipes$().pipe( 
  map((response: AjaxResponse<Recipe[]>) => ({ 
    status: ResponseStatus.SUCCESS, 
    data: (response as AjaxResponse<Recipe[]>).response, 
  })), 
  catchError((error) => of({ status: ResponseStatus.ERROR, error })), 
  startWith({ status: ResponseStatus.LOADING, data: [] }), 
  shareLatest() 
)); 

const [selectedRecipe$, setSelectedRecipe] = createSignal<number>();

export const [useSelectedRecipes] = bind(
  selectedRecipe$.pipe(
    switchMap((selectRecipeId) => getRecipe$(selectRecipeId).pipe(
      map((response) => ({
        status: ResponseStatus.SUCCESS,
        data: (response as AjaxResponse<Recipe>).response,
      })),
      catchError((error) => of({ status: ResponseStatus.ERROR, error })),
      startWith({ status: ResponseStatus.LOADING }),
      shareLatest()
    ))
  ),
  null
);

export { setSelectedRecipe };
