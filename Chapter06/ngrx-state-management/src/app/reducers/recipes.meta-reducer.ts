import { isDevMode } from '@angular/core';
import { ActionReducer, MetaReducer } from '@ngrx/store';
import { AppState } from '.';

export function debug<T>(reducer: ActionReducer<T>): ActionReducer<T> {
  return function (state, action) {
    console.log(`%cState:\n`, 'color: #ffc26e', state);
    console.log(`%cCalling Action: ${action.type}\n`, 'color: #d30b8e');

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [debug] : [];
