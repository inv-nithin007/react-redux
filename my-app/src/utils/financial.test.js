// Test for utility functions that can be extracted from your components
// These are the mathematical calculations and helper functions

describe('Financial Calculations', () => {
  // Extract this function from AddTransaction component
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

  describe('calculateFinancialSummary', () => {
    test('should return zeros for empty transactions', () => {
      const result = calculateFinancialSummary([])
      
      expect(result).toEqual({
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0
      })
    })

    test('should calculate income only', () => {
      const transactions = [
        { amount: 1000 },
        { amount: 2000 },
        { amount: 500 }
      ]
      
      const result = calculateFinancialSummary(transactions)
      
      expect(result).toEqual({
        totalIncome: 3500,
        totalExpense: 0,
        netBalance: 3500
      })
    })

    test('should calculate expenses only', () => {
      const transactions = [
        { amount: -100 },
        { amount: -50 },
        { amount: -200 }
      ]
      
      const result = calculateFinancialSummary(transactions)
      
      expect(result).toEqual({
        totalIncome: 0,
        totalExpense: 350,
        netBalance: -350
      })
    })

    test('should calculate mixed income and expenses', () => {
      const transactions = [
        { amount: 5000 },   // income
        { amount: -200 },   // expense
        { amount: 1500 },   // income  
        { amount: -50 },    // expense
        { amount: -100 }    // expense
      ]
      
      const result = calculateFinancialSummary(transactions)
      
      expect(result).toEqual({
        totalIncome: 6500,
        totalExpense: 350,
        netBalance: 6150
      })
    })

    test('should handle zero amounts', () => {
      const transactions = [
        { amount: 0 },
        { amount: 100 },
        { amount: 0 },
        { amount: -50 }
      ]
      
      const result = calculateFinancialSummary(transactions)
      
      expect(result).toEqual({
        totalIncome: 100,
        totalExpense: 50,
        netBalance: 50
      })
    })

    test('should handle decimal amounts', () => {
      const transactions = [
        { amount: 100.50 },
        { amount: -25.75 },
        { amount: 200.25 }
      ]
      
      const result = calculateFinancialSummary(transactions)
      
      expect(result.totalIncome).toBeCloseTo(300.75)
      expect(result.totalExpense).toBeCloseTo(25.75)
      expect(result.netBalance).toBeCloseTo(275)
    })

    test('should handle large numbers', () => {
      const transactions = [
        { amount: 1000000 },
        { amount: -500000 }
      ]
      
      const result = calculateFinancialSummary(transactions)
      
      expect(result).toEqual({
        totalIncome: 1000000,
        totalExpense: 500000,
        netBalance: 500000
      })
    })
  })
})

describe('Chart Data Processing', () => {
  // Extract this function from Charts component
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

  describe('processExpensesByCategory', () => {
    test('should return empty array for no transactions', () => {
      const result = processExpensesByCategory([])
      
      expect(result).toEqual([])
    })

    test('should return empty array for income-only transactions', () => {
      const transactions = [
        { amount: 1000, category: 'Salary' },
        { amount: 500, category: 'Other' }
      ]
      
      const result = processExpensesByCategory(transactions)
      
      expect(result).toEqual([])
    })

    test('should process single expense category', () => {
      const transactions = [
        { amount: -100, category: 'Food' },
        { amount: -50, category: 'Food' }
      ]
      
      const result = processExpensesByCategory(transactions)
      
      expect(result).toEqual([
        { name: 'Food', value: 150 }
      ])
    })

    test('should process multiple expense categories', () => {
      const transactions = [
        { amount: -100, category: 'Food' },
        { amount: -50, category: 'Travel' },
        { amount: -200, category: 'Shopping' },
        { amount: -25, category: 'Food' }
      ]
      
      const result = processExpensesByCategory(transactions)
      
      expect(result).toHaveLength(3)
      expect(result).toContainEqual({ name: 'Food', value: 125 })
      expect(result).toContainEqual({ name: 'Travel', value: 50 })
      expect(result).toContainEqual({ name: 'Shopping', value: 200 })
    })

    test('should ignore positive amounts (income)', () => {
      const transactions = [
        { amount: 5000, category: 'Salary' },
        { amount: -100, category: 'Food' },
        { amount: 1500, category: 'Other' },
        { amount: -50, category: 'Travel' }
      ]
      
      const result = processExpensesByCategory(transactions)
      
      expect(result).toHaveLength(2)
      expect(result).toContainEqual({ name: 'Food', value: 100 })
      expect(result).toContainEqual({ name: 'Travel', value: 50 })
      // Should not contain Salary or Other (positive amounts)
    })

    test('should handle zero amounts', () => {
      const transactions = [
        { amount: 0, category: 'Other' },
        { amount: -100, category: 'Food' }
      ]
      
      const result = processExpensesByCategory(transactions)
      
      expect(result).toEqual([
        { name: 'Food', value: 100 }
      ])
    })

    test('should handle decimal amounts', () => {
      const transactions = [
        { amount: -25.50, category: 'Food' },
        { amount: -10.75, category: 'Food' },
        { amount: -30.25, category: 'Travel' }
      ]
      
      const result = processExpensesByCategory(transactions)
      
      expect(result).toHaveLength(2)
      expect(result).toContainEqual({ name: 'Food', value: 36.25 })
      expect(result).toContainEqual({ name: 'Travel', value: 30.25 })
    })
  })
})

describe('CSV Processing', () => {
  // Extract this function from AddTransaction component
  function parseCsvLine(line) {
    const trimmedLine = line.trim()
    if (!trimmedLine) return null

    const [title, amount, category, date] = trimmedLine.split(',')
    
    if (title && amount && category && date) {
      return {
        title: title.trim(),
        amount: parseFloat(amount.trim()),
        category: category.trim(),
        date: date.trim()
      }
    }
    
    return null
  }

  function exportToCsvFormat(transactions) {
    const csvHeader = 'title,amount,category,date\n'
    const csvData = transactions.map(transaction => 
      `${transaction.title},${transaction.amount},${transaction.category},${transaction.date}`
    ).join('\n')
    
    return csvHeader + csvData
  }

  describe('parseCsvLine', () => {
    test('should parse valid CSV line', () => {
      const line = 'Coffee,-50,Food,2024-01-15'
      const result = parseCsvLine(line)
      
      expect(result).toEqual({
        title: 'Coffee',
        amount: -50,
        category: 'Food',
        date: '2024-01-15'
      })
    })

    test('should handle whitespace in CSV line', () => {
      const line = ' Coffee , -50 , Food , 2024-01-15 '
      const result = parseCsvLine(line)
      
      expect(result).toEqual({
        title: 'Coffee',
        amount: -50,
        category: 'Food',
        date: '2024-01-15'
      })
    })

    test('should return null for empty line', () => {
      const result = parseCsvLine('')
      expect(result).toBeNull()
    })

    test('should return null for whitespace-only line', () => {
      const result = parseCsvLine('   ')
      expect(result).toBeNull()
    })

    test('should return null for incomplete line', () => {
      const incompleteLines = [
        'Coffee,-50,Food',  // Missing date
        'Coffee,-50',       // Missing category and date
        'Coffee',           // Missing amount, category, date
        ''                  // Empty
      ]
      
      incompleteLines.forEach(line => {
        expect(parseCsvLine(line)).toBeNull()
      })
    })

    test('should return null for line with empty fields', () => {
      const invalidLines = [
        'Coffee,,Food,2024-01-15',      // Empty amount
        ',50,Food,2024-01-15',          // Empty title
        'Coffee,50,,2024-01-15',        // Empty category
        'Coffee,50,Food,'               // Empty date
      ]
      
      invalidLines.forEach(line => {
        expect(parseCsvLine(line)).toBeNull()
      })
    })

    test('should parse positive and negative amounts', () => {
      const incomeLine = 'Salary,5000,Salary,2024-01-01'
      const expenseLine = 'Coffee,-50,Food,2024-01-15'
      
      expect(parseCsvLine(incomeLine).amount).toBe(5000)
      expect(parseCsvLine(expenseLine).amount).toBe(-50)
    })

    test('should parse decimal amounts', () => {
      const line = 'Coffee,-25.50,Food,2024-01-15'
      const result = parseCsvLine(line)
      
      expect(result.amount).toBe(-25.5)
    })
  })

  describe('exportToCsvFormat', () => {
    test('should export single transaction to CSV', () => {
      const transactions = [
        {
          title: 'Coffee',
          amount: -50,
          category: 'Food',
          date: '2024-01-15'
        }
      ]
      
      const result = exportToCsvFormat(transactions)
      
      expect(result).toBe('title,amount,category,date\nCoffee,-50,Food,2024-01-15')
    })

    test('should export multiple transactions to CSV', () => {
      const transactions = [
        { title: 'Coffee', amount: -50, category: 'Food', date: '2024-01-15' },
        { title: 'Salary', amount: 5000, category: 'Salary', date: '2024-01-01' }
      ]
      
      const result = exportToCsvFormat(transactions)
      
      expect(result).toBe(
        'title,amount,category,date\n' +
        'Coffee,-50,Food,2024-01-15\n' +
        'Salary,5000,Salary,2024-01-01'
      )
    })

    test('should export empty array to CSV with header only', () => {
      const result = exportToCsvFormat([])
      
      expect(result).toBe('title,amount,category,date\n')
    })

    test('should handle special characters in transaction data', () => {
      const transactions = [
        {
          title: 'Coffee & Tea',
          amount: -50,
          category: 'Food',
          date: '2024-01-15'
        }
      ]
      
      const result = exportToCsvFormat(transactions)
      
      expect(result).toBe('title,amount,category,date\nCoffee & Tea,-50,Food,2024-01-15')
    })
  })
})