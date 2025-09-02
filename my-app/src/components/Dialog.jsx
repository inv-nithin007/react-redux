import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box
} from '@mui/material'



function EditDialog({ open, onClose, onSave, register, handleSubmit, errors }) {
  return (
    <Dialog open={open} onClose={onClose} >
      <DialogTitle>Edit Transaction</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSave)}>
        <DialogContent>
          <TextField
            {...register("title", { required: "Title is required" })}
            label="Title"
            fullWidth
            sx={{ mb: 2 }}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            {...register("amount", { required: "Amount is required" })}
            sx={{ mb: 2 }}
            label="Amount"
            type="number"
            fullWidth
            error={!!errors.amount}
            helperText={errors.amount?.message}
          />
          <TextField
            sx={{ mb: 2 }}
            {...register("category")}
            label="Category"
            select
            fullWidth
            SelectProps={{ native: true }}
          >
            {['Food', 'Travel', 'Shopping', 'Bills', 'Salary', 'Other'].map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </TextField>
          <TextField
            {...register("date", { required: "Date is required" })}
            label="Date"
            type="date"
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            error={!!errors.date}
            helperText={errors.date?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

function DeleteDialog({ open, onClose, onConfirm, transaction }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to delete this transaction?
        </Typography>
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#f5f5f5', 
          borderRadius: 5, 
          border: '2px solid #999292ff' 
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {transaction?.title}
          </Typography>
      

         
          <Typography variant="body2" color="text.secondary">
            {transaction?.category} •  {new Date(transaction?.date).toLocaleDateString()}
          </Typography>
      
          <Typography 
            variant="h6" 
            sx={{ 
              color: transaction?.amount >= 0 ? 'green' : 'red',
              fontWeight: 600,
              mt: 1
            }}
          >
            ₹{transaction?.amount}
          </Typography>
        </Box>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='contained' color='primary'>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export { EditDialog, DeleteDialog }