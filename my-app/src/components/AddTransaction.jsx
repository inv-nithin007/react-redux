import { Typography, Box, Button ,Paper ,Fade,  InputAdornment, Alert,TextField, Drawer, IconButton} from '@mui/material'
import {
  AttachMoney,
  Category,
  Title,
  CalendarToday,
  Menu,
  Close
} from '@mui/icons-material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addTransaction } from '../store/transactionSlice'

function AddTransaction() {
  const dispatch = useDispatch()
  const transactions = useSelector(state => state.transactions.transactions)
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  let totalIncome = 0
  let totalExpense = 0

  for (const transaction of transactions) {
    if (transaction.amount > 0) {
      totalIncome += transaction.amount
    } else if (transaction.amount < 0) {
      totalExpense += Math.abs(transaction.amount)
    }
  }

  const netBalance = totalIncome - totalExpense
  
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
    <>
    
<IconButton
  onClick={() => setSidebarOpen(true)}
  sx={{
    mt:1,
    backgroundColor: '#2d41f7ff',
    '&:hover': {
      backgroundColor: 'white',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '2rem',
    },
  }}
>
  <Menu />
</IconButton>

    
      <Drawer
        anchor='left'
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{

          '& .MuiDrawer-paper': {
            width: 300,
           
            backgroundColor: '#f5f5f5',
            borderRadius: '10px'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
               Quick Info
            </Typography>
            <IconButton onClick={() => setSidebarOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <Paper elevation={9} sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: '#e8f5e8' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32', fontWeight: 600 }}>
              💰 Total Expenses
            </Typography>
            
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#2e7d32', fontWeight: 500 }}>Total Income:</span>
                <span style={{ color: '#2e7d32', fontWeight: 600 }}>₹{totalIncome.toFixed(2)}</span>
              </Typography>
            </Box>
            
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#d32f2f', fontWeight: 500 }}>Total Expenses:</span>
                <span style={{ color: '#d32f2f', fontWeight: 600 }}>₹{totalExpense.toFixed(2)}</span>
              </Typography>
            </Box>
            
           
            
            <Box>
              <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                <span style={{ color: netBalance >= 0 ? '#2e7d32' : '#d32f2f' }}>Net Balance:</span>
                <span style={{ color: netBalance >= 0 ? '#2e7d32' : '#d32f2f' }}>
                  ₹{netBalance.toFixed(2)}
                </span>
              </Typography>
            </Box>
          </Paper>

          <Paper elevation={9} sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: '#fff3e0' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#ef6c00', fontWeight: 600 }}>
              Pie Chart
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate('/charts')}
              sx={{
                backgroundColor: '#ef6c00',

                borderRadius: 2,
                fontWeight: 600
              }}
            >
              View Chart
            </Button>
          </Paper>

        </Box>
      </Drawer>
    
  

       <Box sx={{maxWidth:500,mx:'auto',width:'100%', mb: 1}}>
            


      <Typography variant="h3" sx={{
        textAlign:'center',mb:4,fontWeight:700,mt:1}}>
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
        Add New Transaction
      </Typography> 

       
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
    </>
  )
}

export default AddTransaction