import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import boardsReducer from './slices/boardsSlice.ts';
import listsReducer from './slices/listsSlice.ts';
import cardsReducer from './slices/cardsSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardsReducer,
    lists: listsReducer,
    cards: cardsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;