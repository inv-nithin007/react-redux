// Non-UI tests for Charts component logic

describe('Charts Component Logic', () => {
  // Test data processing for charts
  function processExpensesByCategory(transactions) {
    const expensesByCategory = {}
    
    transactions.forEach(transaction => {
      if (transaction.amount < 0) {
        const category = transaction.category
        const amount = Math.abs(transaction.amount)
        expensesByCategory[category] = (expensesByCategory[category] || 0) + amount
      }
    })

    return Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }))
  }

  const mockTransactions = [
    { id: '1', title: 'Coffee', amount: -50, category: 'Food', date: '2024-01-15' },
    { id: '2', title: 'Salary', amount: 5000, category: 'Salary', date: '2024-01-01' },
    { id: '3', title: 'Groceries', amount: -200, category: 'Food', date: '2024-01-10' },
    { id: '4', title: 'Bus Ticket', amount: -25, category: 'Travel', date: '2024-01-12' },
    { id: '5', title: 'Shopping', amount: -150, category: 'Shopping', date: '2024-01-14' }
  ]

  describe('Chart Data Processing', () => {
    test('should process expenses by category correctly', () => {
      const result = processExpensesByCategory(mockTransactions)
      
      expect(result).toHaveLength(3) // Food, Travel, Shopping
      expect(result).toContainEqual({ name: 'Food', value: 250 }) // Coffee + Groceries
      expect(result).toContainEqual({ name: 'Travel', value: 25 })
      expect(result).toContainEqual({ name: 'Shopping', value: 150 })
    })

    test('should ignore income transactions', () => {
      const result = processExpensesByCategory(mockTransactions)
      
      // Should not include Salary (positive amount)
      const salaryCategory = result.find(item => item.name === 'Salary')
      expect(salaryCategory).toBeUndefined()
    })

    test('should handle empty transaction list', () => {
      const result = processExpensesByCategory([])
      
      expect(result).toEqual([])
    })

    test('should handle only income transactions', () => {
      const incomeOnly = [
        { amount: 1000, category: 'Salary' },
        { amount: 500, category: 'Other' }
      ]
      
      const result = processExpensesByCategory(incomeOnly)
      
      expect(result).toEqual([])
    })

    test('should group multiple expenses in same category', () => {
      const sameCategory = [
        { amount: -100, category: 'Food' },
        { amount: -50, category: 'Food' },
        { amount: -25, category: 'Food' }
      ]
      
      const result = processExpensesByCategory(sameCategory)
      
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({ name: 'Food', value: 175 })
    })
  })
})