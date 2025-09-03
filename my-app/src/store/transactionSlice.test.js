import transactionSlice, { addTransaction, editTransaction, deleteTransaction } from './transactionSlice'

describe('transactionSlice', () => {
  const mockTransaction1 = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Coffee',
    amount: -50,
    category: 'Food',
    date: '2024-01-15'
  }

  const mockTransaction2 = {
    id: '987fcdeb-51a2-43d1-8765-123456789abc',
    title: 'Salary',
    amount: 5000,
    category: 'Salary',
    date: '2024-01-01'
  }

  describe('initial state', () => {
    test('should return initial state when passed undefined', () => {
      const result = transactionSlice(undefined, { type: 'unknown' })
      expect(result).toEqual({ transactions: [] })
    })
  })

  describe('addTransaction', () => {
    test('should add new transaction to empty state', () => {
      const initialState = { transactions: [] }
      const newTransaction = {
        title: 'Coffee',
        amount: -50,
        category: 'Food',
        date: '2024-01-15'
      }

      const result = transactionSlice(initialState, addTransaction(newTransaction))

      expect(result.transactions).toHaveLength(1)
      expect(result.transactions[0].title).toBe('Coffee')
      expect(result.transactions[0].amount).toBe(-50)
      expect(result.transactions[0].category).toBe('Food')
      expect(result.transactions[0].date).toBe('2024-01-15')
      expect(result.transactions[0].id).toBeDefined()
      expect(typeof result.transactions[0].id).toBe('string')
    })

    test('should add transaction to existing transactions', () => {
      const initialState = { transactions: [mockTransaction1] }
      const newTransaction = {
        title: 'Grocery',
        amount: -200,
        category: 'Food',
        date: '2024-01-16'
      }

      const result = transactionSlice(initialState, addTransaction(newTransaction))

      expect(result.transactions).toHaveLength(2)
      expect(result.transactions[0]).toEqual(mockTransaction1)
      expect(result.transactions[1].title).toBe('Grocery')
    })

    test('should handle positive amounts (income)', () => {
      const initialState = { transactions: [] }
      const incomeTransaction = {
        title: 'Salary',
        amount: 5000,
        category: 'Salary',
        date: '2024-01-01'
      }

      const result = transactionSlice(initialState, addTransaction(incomeTransaction))

      expect(result.transactions[0].amount).toBe(5000)
      expect(result.transactions[0].title).toBe('Salary')
    })

    test('should generate unique IDs for different transactions', () => {
      let state = { transactions: [] }
      
      const transaction1 = { title: 'Coffee', amount: -50, category: 'Food', date: '2024-01-15' }
      const transaction2 = { title: 'Tea', amount: -30, category: 'Food', date: '2024-01-16' }

      state = transactionSlice(state, addTransaction(transaction1))
      state = transactionSlice(state, addTransaction(transaction2))

      expect(state.transactions).toHaveLength(2)
      expect(state.transactions[0].id).not.toBe(state.transactions[1].id)
    })
  })

  describe('editTransaction', () => {
    test('should edit existing transaction', () => {
      const initialState = { transactions: [mockTransaction1, mockTransaction2] }
      const updates = {
        title: 'Expensive Coffee',
        amount: -75
      }

      const result = transactionSlice(initialState, editTransaction({ 
        id: mockTransaction1.id, 
        updates 
      }))

      expect(result.transactions[0].title).toBe('Expensive Coffee')
      expect(result.transactions[0].amount).toBe(-75)
      expect(result.transactions[0].category).toBe('Food')
      expect(result.transactions[0].date).toBe('2024-01-15')
      expect(result.transactions[0].id).toBe(mockTransaction1.id)
    })

    test('should update only specified fields', () => {
      const initialState = { transactions: [mockTransaction1] }
      const updates = { amount: -100 }

      const result = transactionSlice(initialState, editTransaction({ 
        id: mockTransaction1.id, 
        updates 
      }))

      expect(result.transactions[0].amount).toBe(-100)
      expect(result.transactions[0].title).toBe('Coffee')
      expect(result.transactions[0].category).toBe('Food')
    })

    test('should not modify other transactions', () => {
      const initialState = { transactions: [mockTransaction1, mockTransaction2] }
      const updates = { title: 'Updated Coffee' }

      const result = transactionSlice(initialState, editTransaction({ 
        id: mockTransaction1.id, 
        updates 
      }))

      expect(result.transactions[1]).toEqual(mockTransaction2)
    })

    test('should do nothing if transaction ID not found', () => {
      const initialState = { transactions: [mockTransaction1] }
      const updates = { title: 'Non-existent' }

      const result = transactionSlice(initialState, editTransaction({ 
        id: 'non-existent-id', 
        updates 
      }))

      expect(result.transactions).toEqual(initialState.transactions)
    })
  })

  describe('deleteTransaction', () => {
    test('should delete existing transaction', () => {
      const initialState = { transactions: [mockTransaction1, mockTransaction2] }

      const result = transactionSlice(initialState, deleteTransaction(mockTransaction1.id))

      expect(result.transactions).toHaveLength(1)
      expect(result.transactions[0]).toEqual(mockTransaction2)
    })

    test('should delete correct transaction from multiple transactions', () => {
      const transaction3 = {
        id: '111-222-333',
        title: 'Lunch',
        amount: -80,
        category: 'Food',
        date: '2024-01-17'
      }
      const initialState = { transactions: [mockTransaction1, mockTransaction2, transaction3] }

      const result = transactionSlice(initialState, deleteTransaction(mockTransaction2.id))

      expect(result.transactions).toHaveLength(2)
      expect(result.transactions[0]).toEqual(mockTransaction1)
      expect(result.transactions[1]).toEqual(transaction3)
    })

    test('should do nothing if transaction ID not found', () => {
      const initialState = { transactions: [mockTransaction1] }

      const result = transactionSlice(initialState, deleteTransaction('non-existent-id'))

      expect(result.transactions).toEqual(initialState.transactions)
      expect(result.transactions).toHaveLength(1)
    })

    test('should handle deleting from empty state', () => {
      const initialState = { transactions: [] }

      const result = transactionSlice(initialState, deleteTransaction('any-id'))

      expect(result.transactions).toEqual([])
    })

    test('should delete last remaining transaction', () => {
      const initialState = { transactions: [mockTransaction1] }

      const result = transactionSlice(initialState, deleteTransaction(mockTransaction1.id))

      expect(result.transactions).toHaveLength(0)
      expect(result.transactions).toEqual([])
    })
  })

  describe('action creators', () => {
    test('addTransaction should create correct action', () => {
      const payload = {
        title: 'Test Transaction',
        amount: -100,
        category: 'Food',
        date: '2024-01-15'
      }

      const action = addTransaction(payload)

      expect(action.type).toBe('transactions/addTransaction')
      expect(action.payload).toEqual(payload)
    })

    test('editTransaction should create correct action', () => {
      const payload = { id: '123', updates: { title: 'Updated' } }

      const action = editTransaction(payload)

      expect(action.type).toBe('transactions/editTransaction')
      expect(action.payload).toEqual(payload)
    })

    test('deleteTransaction should create correct action', () => {
      const id = '123'

      const action = deleteTransaction(id)

      expect(action.type).toBe('transactions/deleteTransaction')
      expect(action.payload).toBe(id)
    })
  })
})