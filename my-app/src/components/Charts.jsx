import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Box, Typography, Paper, Button } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

function Charts() {
  const transactions = useSelector(state => state.transactions.transactions)
  const navigate = useNavigate()

 
  const expensesByCategory = {}
  transactions.forEach(t => {
    if (t.amount < 0) {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + Math.abs(t.amount)
    }
  })

  const chartData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }))
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'space-between',mb: 3 ,p:2}}>
 
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Expense Charts
        </Typography>
        
        <Button
          startIcon={<ArrowBack />}
          variant='contained'
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
      
      </Box>

      <Paper elevation={8} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
          Expenses by Category
        </Typography>

        {chartData.length > 0 ? (
          <>
            <ResponsiveContainer height={300}>
              <PieChart>
                <Pie
                  data={chartData}
      
                  outerRadius={120}
                  
                  
                >
                  {chartData.map((_, index) => (
                    <Cell  fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
              </PieChart>
            </ResponsiveContainer>
            
            <Box sx={{ mt: 2}}>
              {chartData.map((item, index) => (
                <Box 
                  key={item.name}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    p: 2, 
                    mb: 1,
                    bgcolor: '#d6ceceff',
                    borderRadius: 2,
                    borderLeft: `8px solid ${colors[index]}`
                  }}>
                  <Typography sx={{ fontWeight: 500 }}>{item.name}</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1f1010ff' }}>₹{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', p: 8 }}>
            <Typography variant="h6" sx={{ color: '#666' }}>
              No expenses to display 
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default Charts