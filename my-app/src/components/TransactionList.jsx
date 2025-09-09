import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { editTransaction, deleteTransaction } from '../store/transactionSlice'
import { EditDialog, DeleteDialog } from './Dialog'
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  TextField,
  Pagination,
  Drawer
} from '@mui/material'
import {
  Edit,
  Delete,
  TrendingUp,
  TrendingDown,
  Clear,
  Download,
  Menu,
  Close
} from '@mui/icons-material'

function TransactionList() {
  const transactions = useSelector(state => state.transactions.transactions)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [editDialog, setEditDialog] = useState({ open: false })
  const [deleteDialog, setDeleteDialog] = useState({ open: false })
  const [currentTransaction, setCurrentTransaction] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    fromDate: '',
    toDate: '',
    Inco: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

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

  const filteredTransactions = transactions.filter(transaction => {
    if (filters.Inco == "Income" && transaction.amount < 0) {
      return false

    }
    else

      if (filters.Inco == "Expense" && transaction.amount > 0) {
        return false

      }

    if (filters.fromDate && transaction.date < filters.fromDate) {
    return false
  }
  if (filters.toDate && transaction.date > filters.toDate) {
    return false
  }
  return true
})

const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
const startIndex = (currentPage - 1) * itemsPerPage
const currentTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

const handleClearFilters = () => {
  setFilters({
    category: '',
    fromDate: '',
    toDate: '',
    Inco: ''
  })
  setCurrentPage(1)
}

const handlePageChange = (event, page) => {
  setCurrentPage(page)
}

const handleEdit = (transaction) => {
  reset({
    title: transaction.title,
    amount: transaction.amount,
    category: transaction.category,
    date: transaction.date
  })
  setCurrentTransaction(transaction)
  setEditDialog({ open: true })
}

const handleSaveEdit = (data) => {
  dispatch(editTransaction({
    id: currentTransaction.id,
    updates: {
      title: data.title.trim(),
      amount: parseFloat(data.amount),
      category: data.category,
      date: data.date
    }
  }))
  setEditDialog({ open: false })
  setCurrentTransaction(null)
}

const handleCloseEditDialog = () => {
  setEditDialog({ open: false })
  setCurrentTransaction(null)
  reset()
}

const handleDeleteClick = (transaction) => {
  setCurrentTransaction(transaction)
  setDeleteDialog({ open: true })
}

const handleConfirmDelete = () => {
  dispatch(deleteTransaction(currentTransaction.id))
  setDeleteDialog({ open: false })
  setCurrentTransaction(null)
}

const handleCloseDeleteDialog = () => {
  setDeleteDialog({ open: false })
  setCurrentTransaction(null)
}

const exportToCSV = () => {
  const csvHeader = 'title,amount,category,date\n'
  const csvData = filteredTransactions.map(t =>
    `${t.title},${t.amount},${t.category},${t.date}`
  ).join('\n')

  const blob = new Blob([csvHeader + csvData], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'transactions.csv'
  a.click()
  URL.revokeObjectURL(url)
}

if (transactions.length === 0) {
  return (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        No Transactions Yet
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Add your first transaction above!
      </Typography>
    </Box>
  )
}

return (
  <Box>
    <IconButton
      onClick={() => setSidebarOpen(true)}
      sx={{
        
        
        backgroundColor: '#2d41f7ff',
        ':hover': {
          backgroundColor: '#858080ff',
        },
        '.MuiSvgIcon-root': {
          fontSize: '2rem',
        },
      }}
    >
      <Menu />
    </IconButton>

    <Box sx={{ mt: 1, maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
           Expense Tracker
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/add')}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1.5,
            backgroundColor: '#1976d2',
            fontWeight: 600
          }}
        >
          + Add Transaction
        </Button>
      </Box>

    <Drawer
      anchor='left'
      open={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
      sx={{
        '.MuiDrawer-paper': {
          width: 300,
          backgroundColor: '#f5f5f5',
          borderRadius: '10px'
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
             Quick Info
          </Typography>
          <IconButton onClick={() => setSidebarOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <Paper elevation={12} sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: '#e8f5e8' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32', fontWeight: 1000 }}>
            💰 Total Expenses
          </Typography>
          
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#2e7d32', fontWeight: 500 }}>Total Income:</span>
              <span style={{ color: '#2e7d32', fontWeight: 600 }}>₹{totalIncome.toFixed(2)}</span>
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#d32f2f', fontWeight: 500 }}>Total Expenses:</span>
              <span style={{ color: '#d32f2f', fontWeight: 600 }}>₹{totalExpense.toFixed(2)}</span>
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span style={{ color: netBalance >= 0 ? '#2e7d32' : '#d32f2f' }}>Net Balance:</span>
              <span style={{ color: netBalance >= 0 ? '#2e7d32' : '#d32f2f' }}>
                ₹{netBalance.toFixed(2)}
              </span>
            </Typography>
          </Box>
        </Paper>

        <Paper elevation={9} sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: '#fff3e0' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#ef6c00', fontWeight: 600 }}>
            Pie Chart
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/charts')}
            sx={{
              backgroundColor: '#ef6c00',
              borderRadius: 2,
              fontWeight: 600
            }}
          >
            View Chart
          </Button>
        </Paper>

        <Paper elevation={9} sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: '#e3f2fd' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
            Registration
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/registration')}
            sx={{
              backgroundColor: '#1976d2',
              borderRadius: 2,
              fontWeight: 600
            }}
          >
            Registration
          </Button>
        </Paper>

      </Box>
    </Drawer>

    <Box sx={{
      display: 'flex',
      gap: 3,
      mb: 3,
      p: 3,
      border: '2px solid #d1c5c5ff',
      borderRadius: 8,
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>


      <TextField
        select
        label="Filter by Category"
        InputLabelProps={{ shrink: true }}
        value={filters.category}
        onChange={(e) => {
          setFilters({ ...filters, category: e.target.value })
          setCurrentPage(1)
        }}
        SelectProps={{ native: true }}

      >
        <option value="">All Categories</option>
        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
        <option value="Shopping">Shopping</option>
        <option value="Bills">Bills</option>
        <option value="Salary">Salary</option>
        <option value="Other">Other</option>
      </TextField>

      <TextField
        label="From Date"
        type="date"
        value={filters.fromDate}
        onChange={(e) => {
          setFilters({ ...filters, fromDate: e.target.value })
          setCurrentPage(1)
        }}
        InputLabelProps={{ shrink: true }}

      />

      <TextField
        label="To Date"
        type="date"
        value={filters.toDate}
        onChange={(e) => {
          setFilters({ ...filters, toDate: e.target.value })
          setCurrentPage(1)
        }}
        InputLabelProps={{ shrink: true }}

      />

      <Button
        startIcon={<Clear />}
        variant="outlined"
        onClick={handleClearFilters}
        sx={{ borderRadius: 3 }}
      >
        Clear
      </Button>

      <Button
        startIcon={<Download />}
        variant="contained"
        onClick={exportToCSV}
        sx={{ borderRadius: 3 }}
      >
        Export CSV
      </Button>

      <TextField
        select
        label="Filter by Category"
        InputLabelProps={{ shrink: true }}
        value={filters.Inco}
        onChange={(e) => {
          setFilters({ ...filters, Inco: e.target.value })
          setCurrentPage(1)
        }}
        SelectProps={{ native: true }}

      >
        <option value="">Income/Expense</option>
        <option value="Income">Income</option>
        <option value="Expense">Expense</option>

      </TextField>


    </Box>

    {currentTransactions.map((transaction) => (
      <Paper elevation={9} sx={{ mb: 2, p: 3, border: '1px solid #a39999ff', borderRadius: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6">{transaction.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {transaction.category} •   {new Date(transaction.date).toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {transaction.amount >= 0 ? (
              <TrendingUp sx={{ color: 'green' }} />
            ) : (
              <TrendingDown sx={{ color: 'red' }} />
            )}
            <Typography
              variant="h6"
              sx={{ color: transaction.amount >= 0 ? 'green' : 'red' }}
            >
              ₹{transaction.amount}
            </Typography>
            <IconButton onClick={() => handleEdit(transaction)}>
              <Edit color='primary' />
            </IconButton>
            <IconButton onClick={() => handleDeleteClick(transaction)}>
              <Delete color='error' />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    ))}

    <EditDialog
      open={editDialog.open}
      onClose={handleCloseEditDialog}
      onSave={handleSaveEdit}
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
    />

    <DeleteDialog
      open={deleteDialog.open}
      onClose={handleCloseDeleteDialog}
      onConfirm={handleConfirmDelete}
      transaction={currentTransaction}
    />


    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 5 }}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        size="large"
      />
    </Box>
    
    </Box>
  </Box>
)
}

export default TransactionList