import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const initialState = {
  transactions: []
}

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      const newTransaction = {
        id: uuidv4(), 
        title: action.payload.title,
        amount: action.payload.amount,
        category: action.payload.category,
        date: action.payload.date
      }
      state.transactions.push(newTransaction)
    }
  }
})

export const { addTransaction } = transactionSlice.actions
export default transactionSlice.reducer