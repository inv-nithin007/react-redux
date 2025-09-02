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
  Pagination
} from '@mui/material'
import {
  Edit,
  Delete,
  TrendingUp,
  TrendingDown,
  Clear,
  Download
} from '@mui/icons-material'

function TransactionList() {
  const transactions = useSelector(state => state.transactions.transactions)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [editDialog, setEditDialog] = useState({ open: false })
  const [deleteDialog, setDeleteDialog] = useState({ open: false })
  const [currentTransaction, setCurrentTransaction] = useState(null)
  const [filters, setFilters] = useState({
    category: '',
    fromDate: '',
    toDate: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

 
  const filteredTransactions = transactions.filter(transaction => {
    if (filters.category && transaction.category !== filters.category) {
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
      toDate: ''
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
    <Box sx={{ mt: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight:600,mb: 3, textAlign: 'center' }}>
        Your Transactions
      </Typography>
      
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
      </Box>
      
      {currentTransactions.map((transaction) => (
        <Paper elevation={9} sx={{ mb: 2, p: 3 ,border:'1px solid #a39999ff',borderRadius:5}}>
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
      
     
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4,mb:5 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      
    </Box>
  )
}

export default TransactionList