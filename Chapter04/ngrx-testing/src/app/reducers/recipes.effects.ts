import { Injectable } from "@angular/core";
import { map, catchError, of, exhaustMap } from "rxjs";
import { loadRecipesAction, loadRecipesActionSuccess, loadRecipesActionError } from "./recipes.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RecipesService } from "../services/recipes.service";

@Injectable()
export class RecipesEffects {
  loadRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRecipesAction),
      exhaustMap(() => this.recipesService.getRecipes$()
        .pipe(
          map(recipes => loadRecipesActionSuccess({ recipes })),
          catchError((error: Error) => of(loadRecipesActionError({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private recipesService: RecipesService
  ) {}
}