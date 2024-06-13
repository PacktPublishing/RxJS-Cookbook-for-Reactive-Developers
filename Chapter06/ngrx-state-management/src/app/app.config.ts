import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Action, RootStoreConfig, provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEffects } from '@ngrx/effects';
import { RecipesEffects } from './reducers/recipes.effects';
import { provideHttpClient } from '@angular/common/http';
import { AppState, reducers } from './reducers';
import { recipesFeature } from './reducers/recipes.reducer';
import { metaReducers } from './reducers/recipes.meta-reducer';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideStore(reducers, {
        metaReducers,
        router: routerReducer
    } as RootStoreConfig<AppState, Action>),
    provideState(recipesFeature),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true, // If set to true, the connection is established within the Angular zone
    }),
    provideAnimationsAsync(),
    provideEffects(RecipesEffects),
    provideAnimationsAsync(),
    provideRouterStore(),
  ],
};
