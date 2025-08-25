import { configureStore } from '@reduxjs/toolkit'
import transactionSlice from './transactionSlice'

// Create the Redux store
export const store = configureStore({
  reducer: {
    transactions: transactionSlice,
  },
})

export default store