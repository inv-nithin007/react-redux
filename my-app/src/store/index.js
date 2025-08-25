import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import transactionSlice from './transactionSlice'

// Configuration for redux-persist
const persistConfig = {
  key: 'expense-tracker',
  storage,
}

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, transactionSlice)

// Create the Redux store
export const store = configureStore({
  reducer: {
    transactions: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

// Create persistor
export const persistor = persistStore(store)

export default store