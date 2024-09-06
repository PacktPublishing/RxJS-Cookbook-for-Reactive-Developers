import { rootReducer } from './../recipes.reducer';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, map, shareReplay, withLatestFrom } from 'rxjs';
import { Action } from '../recipes.actions';
import { AppState, Recipe } from '../recipes.types';

@Injectable({
  providedIn: 'root',
})
export class RecipesStoreService {
  private initialState: AppState = {
    recipesState: {
      recipes: [],
      selectedRecipe: null,
      error: null,
      loading: false,
    },
    ordersState: {
      orders: [],
    },
  };
  private state$ = new BehaviorSubject<Readonly<AppState>>(this.initialState);
  public actions$ = new Subject<Action>();

  constructor() {
    this.actions$
      .pipe(
        withLatestFrom(this.state$),
        map(([action, state]) => rootReducer(state, action))
      )
      .subscribe((state: AppState) => {
        this.state$.next(state);
      });
  }

  selectState$(
    selector?: (state: AppState) => Partial<AppState>,
    cachedValues = 1
  ): Observable<Partial<AppState>> {
    return this.state$
      .asObservable()
      .pipe(map(selector || ((state) => state)), shareReplay(cachedValues));
  }

  dispatch({ type, payload }: Action): void {
    this.actions$.next({
      type,
      payload,
    });
  }

  createEffect(handler: () => Observable<any>) {
    return handler().pipe(
      map(({ type, payload, error }) =>
        this.dispatch({ type, payload: payload ?? error })
      )
    );
  }
}
