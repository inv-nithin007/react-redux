import { Typography, Box, Button ,Paper ,  InputAdornment, Alert,TextField, IconButton} from '@mui/material'
import {
  AttachMoney,
  Category,
  Title,
  CalendarToday,
  ArrowBack
}
from '@mui/icons-material'
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
  const [dragActive, setDragActive] = useState(false)

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

  const processFile = (file) => {
    if (!file) return


    if (!file.name.endsWith('.csv')) {
      setMessage('Please upload a CSV file only!')
      setTimeout(() => setMessage(''), 3000)
      return
    }


    if (file.name.length > 100) {
      setMessage('File name too long! Maximum 100 characters allowed.')
      setTimeout(() => setMessage(''), 3000)
      return
    }

   
    const maxFileSize = 1 * 1024 * 1024 * 1024 
    if (file.size > maxFileSize) {
      setMessage('File size too large! Maximum size allowed is 1GB.')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = (e) => {
      const text = e.target.result
      const lines = text.split('\n')
      

      let count = 0

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const [title, amount, category, date] = line.split(',')
        if (title && amount && category && date) {
          dispatch(addTransaction({
            title: title.trim(),
            amount: parseFloat(amount.trim()),
            category: category.trim(),
            date: date.trim()
          }))
          count++
        }
      }

      setMessage(`${count} transactions imported successfully!`)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleCsvUpload = (event) => {
    const file = event.target.files
    processFile(file)
    event.target.value = ''
  }

  const handleDragOver = (e) => {
    e.preventDefault()
   
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
   
    setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
 
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }


  return (
       <Box sx={{maxWidth:500,mx:'auto',width:'100%', mb: 1}}>
         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
           <Button
             onClick={() => navigate('/')}
             variant="outlined"
             startIcon={<ArrowBack />}
             sx={{
               borderRadius: 2
             }}
           >
             Back
           </Button>
         </Box>

      <Typography variant="h3" sx={{
        textAlign:'center',mb:4,fontWeight:700,mt:1}}>
        💰 Expense Tracker
        
      </Typography>

     


    <Paper 
      elevation={12} 
      sx={{ 
        p: 4, 
        borderRadius: 9,
     
        border: '1px solid #f0e4e4ff'
      }}>
        <Typography 
        variant="h4" 
        
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
                      ' .MuiAlert-icon': {
                        fontSize: '2rem'
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
                     
                          InputProps={{
                           startAdornment: (
                            <InputAdornment position="start">
                                   <Title sx={{ color: '#1976d2' }} />
                                     </InputAdornment>
                                          ),
                                         }}
                        sx={{
                          '.MuiOutlinedInput-root': {
                            borderRadius: 3,
                            'input': {
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
                    
                    InputProps={{
                      startAdornment:(
                        <InputAdornment position="start">
                          <AttachMoney sx={{color:'#01a028ff'}}> </AttachMoney>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      ' .MuiOutlinedInput-root':{
                        borderRadius:3,
                        'input':{
                          textAlign:'center'
                        }
                      }
                    }}
                    />

        <TextField
          {...register("category")}
          select
          label="Category"
          
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
            '.MuiOutlinedInput-root': {
              borderRadius: 3, 
            }
          }}
        >
          {['Food', 'Travel', 'Shopping', 'Bills', 'Salary', 'Other'].map(category => (
            <option >
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
              '.MuiOutlinedInput-root':{
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

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', color: 'text.secondary' }}>
                Or import transactions from CSV (title,amount,category,date)
              </Typography>
              
              <Box
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                  border: dragActive ? '4px dashed #1976d2' : '2px dashed #ccc',
                  borderRadius: 4,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                  backgroundColor: dragActive ? '#e0d7d7ff' : '#fafafa',
                  ':hover': {
                    
                    borderColor: '#1976d2',
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ 
                   
                    fontSize: '3rem',
                    mb: 1
                  }}>
                    📁
                  </Typography>
                  <Typography variant="body1" sx={{ 
                   
                    fontWeight: 500,
                    mb: 1
                  }}>
                    {dragActive ? 'Drop CSV file here!' : 'Drag & drop CSV file here'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    or click to browse files
                  </Typography>
                </Box>
                
                <Button
                  component="label"
                  variant="contained"
                  
                  sx={{ 
                    borderRadius: 4,
                    px: 3
                  }}
                >
                  Choose File
                  <input
                    type="file"
                    multiple
                    accept=".csv"
                    onChange={handleCsvUpload}
                    style={{ display: 'none' }}
                  />
                </Button>
              </Box>
              
              <Typography variant="caption" sx={{ 
                display: 'block', 
                textAlign: 'center', 
                mt: 1, 
                color: '#000000ff' 
              }}>
                {message}
              </Typography>
            </Box>

              </Box>  
    </Paper>
    </Box>
  )
}

export default AddTransaction