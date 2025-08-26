import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
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
  MenuItem,
  Fade,
  Zoom,
  Avatar,
  Divider
} from '@mui/material'
import {
  ExpandMore,
  ExpandLess,
  Edit,
  Delete,
  TrendingUp,
  TrendingDown,
  Receipt,
  AttachMoney
} from '@mui/icons-material'

function TransactionList() {
  const transactions = useSelector(state => state.transactions.transactions)
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
      <>
        <Fade in timeout={900}>
          <Box sx={{ 
            textAlign: 'center', 
          
            p: 4,
            maxWidth: 600,
            mx: 'auto'
          }}>

            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
              No Transactions Yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
             add your first transaction above! 
            </Typography>
          </Box>
        </Fade>
        
        <Button
          variant="contained"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
          }}
          onClick={() => {
            console.log('Button clicked - navigating to /hi')
            navigate('/hi')
          }}
        >
          Go to Hi
        </Button>
      </>
    )
  }

  return (
    <Box sx={{ mt: 4, maxWidth: 800, mx: 'auto', width: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3,
        justifyContent: 'center'
      }}>
        <Avatar sx={{ 
          mr: 2, 
          background: '#49abe4ff' 
        }}>
          <AttachMoney />
        </Avatar>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
           

          }}>
          Your Transactions

        </Typography>
      </Box>
      
      {transactions.map((transaction, index) => (
  
          <Card 
            sx={{ 
              mb: 3, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              position: 'relative',
              overflow: 'visible',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-8px) scale(1.02)', 
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 6,
                background: transaction.amount >= 0 
                  ? 'linear-gradient(180deg, #4CAF50 0%, #81C784 100%)'
                  : 'linear-gradient(180deg, #F44336 0%, #E57373 100%)',
                borderRadius: '0 3px 3px 0'
              }
            }}
          >
          <CardContent sx={{ p: 3 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={1}>
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40,
                    background: transaction.amount >= 0 
                      ? 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)'
                      : 'linear-gradient(135deg, #F44336 0%, #E57373 100%)'
                  }}
                >
                  {transaction.amount >= 0 ? (
                    <TrendingUp sx={{ color: 'white' }} />
                  ) : (
                    <TrendingDown sx={{ color: 'white' }} />
                  )}
                </Avatar>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {transaction.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '0.9rem' }}>
                  {new Date(transaction.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Typography>
              </Grid>
              
              <Grid item xs={2}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: transaction.amount >= 0 ? '#4CAF50' : '#F44336',
                    fontWeight: 700,
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </Typography>
              </Grid>
              
              <Grid item xs={2}>
                <Chip 
                  label={transaction.category}
                  size="medium"
                  sx={{ 
                    background: `linear-gradient(135deg, ${getCategoryColor(transaction.category)} 0%, ${getCategoryColor(transaction.category)}88 100%)`,
                    color: 'white',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={3}>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton 
                    onClick={() => toggleExpand(transaction.id)}
                    sx={{
                      background: 'rgba(33, 150, 243, 0.1)',
                      '&:hover': { 
                        background: 'rgba(33, 150, 243, 0.2)',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    {expanded[transaction.id] ? 
                      <ExpandLess sx={{ color: '#1976d2' }} /> : 
                      <ExpandMore sx={{ color: '#1976d2' }} />
                    }
                  </IconButton>
                  <IconButton 
                    onClick={() => handleEdit(transaction)}
                    sx={{
                      background: 'rgba(76, 175, 80, 0.1)',
                      '&:hover': { 
                        background: 'rgba(76, 175, 80, 0.2)',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <Edit sx={{ color: '#4CAF50' }} />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(transaction.id)}
                    sx={{
                      background: 'rgba(244, 67, 54, 0.1)',
                      '&:hover': { 
                        background: 'rgba(244, 67, 54, 0.2)',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <Delete sx={{ color: '#F44336' }} />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
            
            <Collapse in={expanded[transaction.id]}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ 
                mt: 2, 
                p: 3, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                color: 'white'
              }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  📊 Transaction Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      <strong>Type:</strong> {transaction.amount >= 0 ? 'Income 💰' : 'Expense 💸'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      <strong>Category:</strong> {transaction.category}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      <strong>Full Date:</strong> {new Date(transaction.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      <strong>Transaction ID:</strong> {transaction.id.slice(0, 8)}...
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      
      ))}

     
      <Dialog 
        open={editDialog.open} 
        onClose={() => setEditDialog({ open: false, transaction: null })} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
          fontWeight: 600
        }}>
          ✏️ Edit Transaction
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={editForm.title || ''}
            onChange={(e) => setEditForm({...editForm, title: e.target.value})}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
          <TextField
            label="Amount"
            type="number"
            fullWidth
            margin="normal"
            value={editForm.amount || ''}
            onChange={(e) => setEditForm({...editForm, amount: parseFloat(e.target.value)})}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
          <TextField
            label="Category"
            select
            fullWidth
            margin="normal"
            value={editForm.category || ''}
            onChange={(e) => setEditForm({...editForm, category: e.target.value})}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setEditDialog({ open: false, transaction: null })}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained"
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)',
              }
            }}
          >
            💾 Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      <Button
        variant="contained"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
        }}
        onClick={() => setShowHi(true)}
      >
        Go to Hi
      </Button>
    </Box>
  )
}

export default TransactionList