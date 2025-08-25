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
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Divider
} from '@mui/material'
import { Add } from '@mui/icons-material'

function AddTransaction() {
  const dispatch = useDispatch()
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' })
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      amount: '',
      category: 'Other',
      date: new Date().toISOString().split('T')[0]
    }
  })

  const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Salary', 'Other']

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

    setAlert({ show: true, message: 'Transaction added!', severity: 'success' })
    setTimeout(() => setAlert({ show: false, message: '', severity: 'success' }), 3000)
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Typography variant="h5">
          Add Transaction
        </Typography>
        <Chip 
          label="New" 
          color="primary" 
          size="small"
        />
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {alert.show && (
        <Alert severity={alert.severity} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select {...field} label="Category">
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    <Chip 
                      label={category} 
                      size="small" 
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

        <Divider />

        <Button
          type="submit"
          variant="contained"
          startIcon={<Add />}
          size="large"
        >
          Add Transaction
        </Button>
      </Box>
    </Paper>
  )
}

export default AddTransaction