import { configureStore } from '@reduxjs/toolkit';
import { honeypotApi } from './services/api';
import cartReducer from './services/cartSlice'; 
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

// Configuration for persistence
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'], // Only persist the cart, not the API cache
};

const persistedCartReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    [honeypotApi.reducerPath]: honeypotApi.reducer,
    cart: persistedCartReducer, // Use the persisted version
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for Redux Persist to work without errors
    }).concat(honeypotApi.middleware),
});

export const persistor = persistStore(store); // Export the persistor

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;