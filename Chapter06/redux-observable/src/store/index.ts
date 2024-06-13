import { configureStore } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import { fetchRecipesEpic } from './epics';
import recipesReducer from './reducer';

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    recipesState: recipesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(epicMiddleware),
});

epicMiddleware.run(fetchRecipesEpic);

export type RootState = ReturnType<typeof store.getState>;

