import { Injectable } from "@angular/core";
import { map, catchError, of, exhaustMap } from "rxjs";
import { completeErrorRecipesAction, completeRecipesAction, loadRecipesAction } from "./recipes.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RecipesService } from "../services/recipes.service";

@Injectable()
export class RecipesEffects {
  loadRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRecipesAction),
      exhaustMap(() => this.recipesService.getRecipes$()
        .pipe(
          map(recipes => completeRecipesAction({ recipes })),
          catchError(() => of(completeErrorRecipesAction()))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private recipesService: RecipesService
  ) {}
}