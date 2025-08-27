import { Typography, Box, Button ,Paper ,Fade,  InputAdornment, Alert,TextField,Dialog,DialogTitle,DialogContent} from '@mui/material'
import {
  AttachMoney,
  Category,
  Title,
  CalendarToday
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { addTransaction } from '../store/transactionSlice'

function Hi() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
    const [message, setMessage] = useState('') ;
      const { register, handleSubmit, reset, formState: { errors } } = useForm({
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
    
    <Box sx={{maxWidth:500,mx:'auto',width:'100%', mb: 4}}>
      <Typography variant="h3" sx={{
        textAlign:'center',mb:4,fontWeight:700,mt:5}}>
        💰 Expense Tracker
      </Typography>

    <Paper 
      elevation={8} 
      sx={{ 
        p: 4, 
        borderRadius: 9,
     
        border: '3px solid #dbd9d9ff'
      }}>
        <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          color: '#251515ff', 
          fontWeight: 600,
          textAlign: 'center',
          mb: 3
        }}
      >
        ✨ Add New Transaction
      </Typography> 

            <Fade in={!!message} timeout={500}>
              <Box sx={{ mb: 2 }}>
                {message && (
                  <Alert 
                    severity="success" 
                    sx={{ 
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        fontSize: '1.5rem'
                      }
                    }}
                  >
                    {message}
                  </Alert>
                )}
              </Box>
            </Fade> 

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

        <TextField
          {...register("title", { required: "Title is required" })}
          label="Title"
          placeholder="Coffee, Salary, Groceries"
          error={!!errors.title}
          helperText={errors.title?.message}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Title sx={{ color: '#1976d2' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover': {
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }
            }
          }}
        />

        <TextField
          {...register("amount", { 
            required: "Amount is required",
            validate: value => !isNaN(value) || "Must be a valid number"
          })}
          label="Amount"
          type="number"
          placeholder="+ income, - expense"
          helperText={errors.amount?.message || "Positive for income, negative for expense"}
          error={!!errors.amount}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney sx={{ color: '#1976d2' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />

        <TextField
          {...register("category")}
          select
          label="Category"
          fullWidth
           InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Category sx={{ color: '#ee4444ff' }} />
              </InputAdornment>
            ),
          }}
          SelectProps={{
            native: true,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3
            }
          }}
        >
          {['Food', 'Travel', 'Shopping', 'Bills', 'Salary', 'Other'].map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </TextField>

        <TextField
          {...register("date")}
          label="Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarToday sx={{ color: '#1976d2' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover': {
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }
            }
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          sx={{
            mt: 2,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              boxShadow: 3
            }
          }}
        >
          ✨ Add Transaction
        </Button>

















                    
              
              </Box>  



      <Button
        variant='contained' 
        color='primary'
        sx={{mt:5,borderRadius:10}}
        onClick={() => navigate('/')}
      >
        Back
      </Button>

             <Dialog 
                  open={true} 
                 
                  fullWidth
                >
                  <DialogTitle>Edit Transaction</DialogTitle>

                </Dialog>


      </Paper>
    </Box>
  )
}

export default Hi