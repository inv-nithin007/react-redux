import { Typography, Box, Button ,Paper ,  InputAdornment, Alert,TextField, Drawer, IconButton} from '@mui/material'
import {
  AttachMoney,
  Category,
  Title,
  CalendarToday,
  Menu,
  Close 
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
    const file = event.target.files[0]
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
    <>
    
<IconButton
  onClick={() => setSidebarOpen(true)}
  sx={{
    mt:1,
    backgroundColor: '#2d41f7ff',
    ':hover': {
      backgroundColor: '#858080ff',
    },
    '.MuiSvgIcon-root': {
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

          '.MuiDrawer-paper': {
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

          <Paper elevation={12} sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: '#e8f5e8' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32', fontWeight: 1000 }}>
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
                  '&:hover': {
                    
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
                color: 'text.secondary' 
              }}>
                Supported format: CSV files only • Max 100 charachter filename • Max 1GB file size
              </Typography>
            </Box>

              </Box>  
    </Paper>
    </Box>
    </>
  )
}

export default AddTransaction