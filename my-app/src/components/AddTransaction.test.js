

describe('AddTransaction Component Logic', () => {

  function calculateFinancialSummary(transactions) {
    let totalIncome = 0
    let totalExpense = 0

    for (const transaction of transactions) {
      if (transaction.amount > 0) {
        totalIncome += transaction.amount
      } else if (transaction.amount < 0) {
        totalExpense += Math.abs(transaction.amount)
      }
    }

    const netBalance = totalIncome - totalExpense
    
    return { totalIncome, totalExpense, netBalance }
  }

  describe('Financial Summary Calculations', () => {
    test('should calculate correct totals with mixed transactions', () => {
      const transactions = [
        { amount: 5000 },   
        { amount: -200 },   
        { amount: 1500 },    
        { amount: -50 },    
        { amount: -100 }    
      ]
      
      const result = calculateFinancialSummary(transactions)
      
      expect(result).toEqual({
        totalIncome: 6500,
        totalExpense: 350,
        netBalance: 6150
      })
    })

    test('should handle empty transaction list', () => {
      const result = calculateFinancialSummary([])
      
      expect(result).toEqual({
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0
      })
    })

    test('should handle only income transactions', () => {
      const transactions = [
        { amount: 1000 },
        { amount: 2000 }
      ]
      
      const result = calculateFinancialSummary(transactions)
      
      expect(result).toEqual({
        totalIncome: 3000,
        totalExpense: 0,
        netBalance: 3000
      })
    })

    test('should handle only expense transactions', () => {
      const transactions = [
        { amount: -100 },
        { amount: -50 }
      ]
      
      const result = calculateFinancialSummary(transactions)
      
      expect(result).toEqual({
        totalIncome: 0,
        totalExpense: 150,
        netBalance: -150
      })
    })
  })
})