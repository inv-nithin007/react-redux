import { configureStore } from '@reduxjs/toolkit'
import transactionSlice from './transactionSlice'


export const store = configureStore({
  reducer: {
    transactions: transactionSlice,
  },
})

export default store
