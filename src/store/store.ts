import { configureStore } from '@reduxjs/toolkit';
import { apiGateway } from '../services/apiGateway';

export const store = configureStore({
  reducer: {
    [apiGateway.reducerPath]: apiGateway.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiGateway.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;