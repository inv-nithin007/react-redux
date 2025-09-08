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
      const { title, amount, category, date } = action.payload
      
      // Check if identical transaction exists
      const existingIndex = state.transactions.findIndex(t => 
        t.title === title && 
        t.category === category && 
        t.date === date
      )
      
      if (existingIndex !== -1) {
        // Add to existing transaction
        state.transactions[existingIndex].amount += amount
      } else {
        // Create new transaction
        const newTransaction = {
          id: uuidv4(),
          title,
          amount,
          category,
          date
        }
        state.transactions.push(newTransaction)
      }
    },
    editTransaction: (state, action) => {
      const { id, updates } = action.payload
      const index = state.transactions.findIndex(transaction => transaction.id === id)
      if (index !== -1) {
        state.transactions[index] = { ...state.transactions[index], ...updates }
      }
    },
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter(transaction => transaction.id !== action.payload)
    }
  }
})

export const { addTransaction, editTransaction, deleteTransaction } = transactionSlice.actions
export default transactionSlice.reducer
