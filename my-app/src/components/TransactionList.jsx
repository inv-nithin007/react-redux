import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { editTransaction, deleteTransaction } from '../store/transactionSlice'
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material'
import {
  Edit,
  Delete,
  TrendingUp,
  TrendingDown,
  FilterList,
  Clear
} from '@mui/icons-material'

function TransactionList() {
  const transactions = useSelector(state => state.transactions.transactions)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [editDialog, setEditDialog] = useState({ open: false })
  const [editingId, setEditingId] = useState(null)
  const [filters, setFilters] = useState({
    category: '',
    fromDate: '',
    toDate: ''
  })
  
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

  const handleClearFilters = () => {
    setFilters({
      category: '',
      fromDate: '',
      toDate: ''
    })
  }

  const handleEdit = (transaction) => {
    reset({
      title: transaction.title,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date
    })
    setEditingId(transaction.id)
    setEditDialog({ open: true })
  }

  const handleSaveEdit = (data) => {
    dispatch(editTransaction({ 
      id: editingId, 
      updates: {
        title: data.title.trim(),
        amount: parseFloat(data.amount),
        category: data.category,
        date: data.date
      }
    }))
    setEditDialog({ open: false })
    setEditingId(null)
  }

  const handleCloseDialog = () => {
    setEditDialog({ open: false })
    setEditingId(null)
    reset()
  }

  const handleDelete = (id) => {
    dispatch(deleteTransaction(id))
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
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/hi')}
        >
          Go to Hi
        </Button>
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
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          SelectProps={{ native: true }}
          sx={{ minWidth: 150 }}
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
          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
        />

        <TextField
          label="To Date"
          type="date"
          value={filters.toDate}
          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
        />

        <Button
          startIcon={<Clear />}
          variant="outlined"
          onClick={handleClearFilters}
          sx={{ borderRadius: 3 }}
        >
          Clear
        </Button>
      </Box>
      
      {filteredTransactions.map((transaction) => (
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
              <IconButton onClick={() => handleDelete(transaction.id)}>
                <Delete color='error' />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      ))}

      <Dialog 
        open={editDialog.open} 
        onClose={handleCloseDialog} 
        fullWidth
      >
        <DialogTitle>Edit Transaction</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(handleSaveEdit)}>
          <DialogContent>
            <TextField
              {...register("title", { required: "Title is required",min:2 })}
              label="Title"
              fullWidth
              sx={{mb:2}}
            
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              {...register("amount", { 
                required: "Amount is required"
              })}
              sx={{mb:2}}
              label="Amount"
              type="number"
              fullWidth
              
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />
            <TextField
            sx={{mb:2}}
              {...register("category")}
              label="Category"
              select
              fullWidth
              
              SelectProps={{ native: true }}
            >
              {['Food', 'Travel', 'Shopping', 'Bills', 'Salary', 'Other'].map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </TextField>
            <TextField
              {...register("date", { required: "Date is required" })}
              label="Date"
              type="date"
              fullWidth
              sx={{mb:2}}
              InputLabelProps={{ shrink: true }}
              error={!!errors.date}
              helperText={errors.date?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      
      <Button
        variant="contained"
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
        onClick={() => navigate('/hi')}
      >
        Go to Hi
      </Button>
    </Box>
  )
}

export default TransactionList