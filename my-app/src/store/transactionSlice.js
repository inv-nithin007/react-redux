import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'


const initialState = {
  transactions: [], 
  filters: {
    category: 'All',
    dateFrom: '',
    dateTo: ''
  }
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
        date: action.payload.date,
        createdAt: new Date().toISOString()
      }
      state.transactions.push(newTransaction)
    },

    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter(
        transaction => transaction.id !== action.payload
      )
    },
    
    
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    }
  }
})
export const { addTransaction, deleteTransaction, setFilter } = transactionSlice.actions

export default transactionSlice.reducer