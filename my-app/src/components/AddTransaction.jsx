import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { addTransaction } from '../store/transactionSlice'
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert
} from '@mui/material'

function AddTransaction() {
  const dispatch = useDispatch()
  const [message, setMessage] = useState('')
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      amount: '',
      category: 'Other',
      date: new Date().toISOString().split('T')[0]
    }
  })

 

  const onSubmit = (data) => {
    dispatch(addTransaction({
      title: data.title.trim(),
      amount: parseFloat(data.amount),
      category: data.category,
      date: data.date
    }))

    reset({
      title: '',
      amount: '',
      category: 'Other',
      date: new Date().toISOString().split('T')[0]
    })

    setMessage('Transaction added successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <Box sx={{maxWidth:400,mx:'auto',width:'100%'}}>
    <Paper elevation={10} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add Transaction
      </Typography>
      
      {message && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Controller
          name="title"
          control={control}
          rules={{ required: 'Title is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Title"
              placeholder="Coffee, Salary, Groceries"
              error={!!errors.title}
              helperText={errors.title?.message}
              fullWidth
            />
          )}
        />

        <Controller
          name="amount"
          control={control}
          rules={{ 
            required: 'Amount is required',
            validate: value => !isNaN(value) || 'Must be a valid number'
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Amount"
              type="number"
              placeholder="+ income, - expense"
              helperText={errors.amount?.message || "Positive for income, negative for expense"}
              error={!!errors.amount}
              fullWidth
            />
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <TextField

              label="Category"
              fullWidth
            >
  
            </TextField>
          )}
        />

        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
        >
          Add Transaction
        </Button>
      </Box>
    </Paper>
    </Box>
  )
}

export default AddTransaction
