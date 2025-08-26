import { Typography, Box, Button ,Paper ,Fade,  InputAdornment, Alert,TextField} from '@mui/material'
import {
  AttachMoney,
  Category,
  Title,
  CalendarToday
} from '@mui/icons-material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { addTransaction } from '../store/transactionSlice'

function AddTransaction() {
  const dispatch = useDispatch()
  const [message, setMessage] = useState('')
  
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
                            borderRadius: 3,
                            '& input': {
                              textAlign: 'center'
                            }
                          }
                        }}
                      />
              
                    <TextField
                    {...register("amount",{required: 'Enter The Amount'})}
                    label='Amount'
                    placeholder='Income or Expense'
                    type='number'
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                    fullWidth
                    InputProps={{
                      startAdornment:(
                        <InputAdornment position="start">
                          <AttachMoney sx={{color:'#01a028ff'}}> </AttachMoney>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root':{
                        borderRadius:3,
                        '& input':{
                          textAlign:'center'
                        }
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
                <Category sx={{ color: '#0f53e4ff' }} />
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
            {...register('date',{required:'Enter the Date'})}
            fullWidth
            label='Date'
            type='date'
            InputProps={{
              startAdornment:(
                <InputAdornment position="start">
                  <CalendarToday sx={{color:'#12caebff'}}></CalendarToday>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root':{
                borderRadius:3
              }
            }}


            />

            <Button
              fullWidth
              size='large'
              variant='contained'
              type='submit'
              sx={{borderRadius:15}}>
                💰  Add Transcation
            </Button>

              </Box>  
    </Paper>
    </Box>
  )
}

export default AddTransaction