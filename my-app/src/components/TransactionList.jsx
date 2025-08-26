import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { editTransaction, deleteTransaction } from '../store/transactionSlice'
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem
} from '@mui/material'
import {
  ExpandMore,
  ExpandLess,
  Edit,
  Delete,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material'

function TransactionList() {
  const transactions = useSelector(state => state.transactions.transactions)
  const dispatch = useDispatch()
  const [expanded, setExpanded] = useState({})
  const [editDialog, setEditDialog] = useState({ open: false, transaction: null })
  const [editForm, setEditForm] = useState({})

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleEdit = (transaction) => {
    setEditForm(transaction)
    setEditDialog({ open: true, transaction })
  }

  const handleSaveEdit = () => {
    dispatch(editTransaction({ id: editDialog.transaction.id, updates: editForm }))
    setEditDialog({ open: false, transaction: null })
  }

  const handleDelete = (id) => {
    dispatch(deleteTransaction(id))
  }

  const getCategoryColor = (category) => {
    const colors = {
      Food: '#FF6B6B',
      Travel: '#4ECDC4', 
      Shopping: '#45B7D1',
      Bills: '#FFA07A',
      Salary: '#98D8C8',
      Other: '#F7DC6F'
    }
    return colors[category] || '#95A5A6'
  }

  if (transactions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No transactions yet. Add your first transaction above! 📊
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ mt: 3, maxWidth: 800, mx: 'auto', width: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
        Your Transactions
      </Typography>
      
      {transactions.map((transaction) => (
        <Card 
          key={transaction.id} 
          sx={{ 
            mb: 2, 
            borderLeft: `4px solid ${transaction.amount >= 0 ? '#4CAF50' : '#F44336'}`,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': { 
              transform: 'translateY(-2px)', 
              boxShadow: 4 
            }
          }}
        >
          <CardContent>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={1}>
                {transaction.amount >= 0 ? (
                  <TrendingUp sx={{ color: '#4CAF50' }} />
                ) : (
                  <TrendingDown sx={{ color: '#F44336' }} />
                )}
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {transaction.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(transaction.date).toLocaleDateString()}
                </Typography>
              </Grid>
              
              <Grid item xs={2}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: transaction.amount >= 0 ? '#4CAF50' : '#F44336',
                    fontWeight: 600 
                  }}
                >
                  {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </Typography>
              </Grid>
              
              <Grid item xs={2}>
                <Chip 
                  label={transaction.category}
                  size="small"
                  sx={{ 
                    bgcolor: getCategoryColor(transaction.category),
                    color: 'white',
                    fontWeight: 500
                  }}
                />
              </Grid>
              
              <Grid item xs={3}>
                <IconButton 
                  onClick={() => toggleExpand(transaction.id)}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  {expanded[transaction.id] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
                <IconButton 
                  onClick={() => handleEdit(transaction)}
                  size="small"
                  color="primary"
                  sx={{ mr: 1 }}
                >
                  <Edit />
                </IconButton>
                <IconButton 
                  onClick={() => handleDelete(transaction.id)}
                  size="small"
                  color="error"
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
            
            <Collapse in={expanded[transaction.id]}>
              <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Transaction Details:</strong>
                </Typography>
                <Typography variant="body2">
                  <strong>Type:</strong> {transaction.amount >= 0 ? 'Income 💰' : 'Expense 💸'}
                </Typography>
                <Typography variant="body2">
                  <strong>Category:</strong> {transaction.category}
                </Typography>
                <Typography variant="body2">
                  <strong>Date:</strong> {new Date(transaction.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
                <Typography variant="body2">
                  <strong>ID:</strong> {transaction.id.slice(0, 8)}...
                </Typography>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, transaction: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={editForm.title || ''}
            onChange={(e) => setEditForm({...editForm, title: e.target.value})}
          />
          <TextField
            label="Amount"
            type="number"
            fullWidth
            margin="normal"
            value={editForm.amount || ''}
            onChange={(e) => setEditForm({...editForm, amount: parseFloat(e.target.value)})}
          />
          <TextField
            label="Category"
            select
            fullWidth
            margin="normal"
            value={editForm.category || ''}
            onChange={(e) => setEditForm({...editForm, category: e.target.value})}
          >
            {['Food', 'Travel', 'Shopping', 'Bills', 'Salary', 'Other'].map(category => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={editForm.date || ''}
            onChange={(e) => setEditForm({...editForm, date: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, transaction: null })}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TransactionList