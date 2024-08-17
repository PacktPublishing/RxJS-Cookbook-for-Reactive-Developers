import {
  Action,
  LOAD_RECIPES,
  LOAD_RECIPES_ERROR,
  LOAD_RECIPES_SUCCESS,
  ORDER_RECIPE,
  SELECT_RECIPE,
  on,
} from './recipes.actions';
import { AppState } from './recipes.types';
import { logMetaReducer } from './recipes.utils';

export type Reducer<S, A extends Action> = (state: S, action: A) => S;

function combineReducers<S, A extends Action>(reducers: { [K in keyof S]: Reducer<S[K], A> }): Reducer<S, A> {
  return (state: S | undefined, action: A): S => {
    if (!state) return {} as S;

    const newState = { ...state } as S;

    for (let key in reducers) {
      newState[key] = reducers[key](state[key], action);
    }

    return newState;
  };
}

function createReducer(...ons: Record<string, any>[]): Reducer<AppState, Action> {
  return function (state: AppState, action: Action) {
    for (let on of ons) {
      if (action.type === on.actionType) {
        return on.reducerFn(state, action);
      }
    }

    return state;
  };
}

export const recipesReducer = createReducer(
  on(LOAD_RECIPES, (state: AppState) =>
    Object.assign({}, structuredClone(state), {
      loading: true,
    })
  ),
  on(LOAD_RECIPES_SUCCESS, (state: AppState, { payload }: Action) => 
    Object.assign({}, structuredClone(state), {
      recipes: payload ?? [],
      loading: false,
    })
  ),
  on(LOAD_RECIPES_ERROR, (state: AppState, { payload }: Action) => 
    Object.assign({}, structuredClone(state), {
      error: payload,
      loading: false,
    })
  ),
  on(SELECT_RECIPE, (state: AppState, { payload }: Action) => 
    Object.assign({}, structuredClone(state), {
      selectedRecipe: payload,
    })
  ),
);

export const recipeOrderReducer = createReducer(
  on(ORDER_RECIPE, (state: AppState, { payload }: Action) => 
    Object.assign({}, structuredClone(state), {
      order: payload,
    })
  ),
)

export const rootReducer = logMetaReducer(combineReducers({
  recipesState: recipesReducer,
  ordersState: recipeOrderReducer
}), this);
