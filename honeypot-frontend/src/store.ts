import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { honeypotApi } from './services/api';
import cartReducer from './services/cartSlice';
import authReducer from './services/authSlice'; // Import Auth
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  [honeypotApi.reducerPath]: honeypotApi.reducer,
  cart: cartReducer,
  auth: authReducer, // Add Auth here
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'auth'], // Persist both!
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(honeypotApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;