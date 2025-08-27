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
  TrendingDown
} from '@mui/icons-material'

function TransactionList() {
  const transactions = useSelector(state => state.transactions.transactions)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [editDialog, setEditDialog] = useState({ open: false })
  const [editingId, setEditingId] = useState(null)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

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
      
      {transactions.map((transaction) => (
        <Paper sx={{ mb: 2, p: 3 ,border:'3px solid #d1c5c5ff',borderRadius:5}}>
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
              {...register("title", { required: "Title is required" })}
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