import { useSelector, useDispatch } from 'react-redux'
import { deleteTransaction } from '../store/transactionSlice'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
  IconButton
} from '@mui/material'
import { TrendingUp, TrendingDown, Delete } from '@mui/icons-material'

function TransactionList() {
  const transactions = useSelector((state) => state.transactions.transactions)
  const dispatch = useDispatch()

  if (transactions.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Your Transactions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No transactions yet. Add your first transaction above!
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper>
      <Box sx={{ p: 3, pb: 1 }}>
        <Typography variant="h5" gutterBottom>
          Your Transactions
        </Typography>
        <Chip 
          label={`${transactions.length} transactions`} 
          color="primary" 
          variant="outlined"
          size="small"
        />
      </Box>
      
      <List>
        {transactions.map((transaction, index) => (
          <Box key={transaction.id}>
            <ListItem>
              <ListItemIcon>
                {transaction.amount > 0 ? 
                  <TrendingUp color="success" /> : 
                  <TrendingDown color="error" />
                }
              </ListItemIcon>
              
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                      {transaction.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      color={transaction.amount > 0 ? 'success.main' : 'error.main'}
                      fontWeight="bold"
                    >
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                      <Chip 
                        label={transaction.category} 
                        size="small" 
                        color={transaction.amount > 0 ? 'success' : 'error'}
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(transaction.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
                      ID: {transaction.id.substring(0, 8)}...
                    </Typography>
                  </>
                }
              />
              
              <IconButton 
                onClick={() => dispatch(deleteTransaction(transaction.id))}
                color="error"
                size="small"
              >
                <Delete />
              </IconButton>
            </ListItem>
            
            {index < transactions.length - 1 && <Divider variant="inset" component="li" />}
          </Box>
        ))}
      </List>
    </Paper>
  )
}

export default TransactionList