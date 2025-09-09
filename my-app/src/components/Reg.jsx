import { 
  Typography, 
  Box, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  TextField, 
  Alert 
} from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

function Reg() {
  const [activeStep, setActiveStep] = useState(0)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [imageError, setImageError] = useState('')

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: ''
    }
  })

  const steps = ['Personal Info', 'Upload Image', 'Preview & Submit']
  
  const formData = watch()

  const handleNext = () => {
    setActiveStep(activeStep + 1)
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file)
        setImageError('')
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target.result)
        }
        reader.readAsDataURL(file)
      } else {
        setImageError('Please select an image file only!')
        setTimeout(() => {
          setImageError('')
        }, 3000)
      }
    }
    event.target.value = ''
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const onSubmit = (data) => {
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              {...register('firstName')}
              fullWidth
              label="First Name"
              sx={{ '.MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField
              {...register('lastName')}
              fullWidth
              label="Last Name"
              sx={{ '.MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField
              {...register('gender')}
              select
              fullWidth
              label="Gender"
              SelectProps={{ native: true }}
              sx={{ '.MuiOutlinedInput-root': { borderRadius: 3 } }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
             
            </TextField>
          </Box>
        )
      
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
              Upload Profile Image
            </Typography>
            
            {imagePreview && (
              <Box sx={{ 
                width: 200, 
                height: 200, 
                borderRadius: 2, 
            
                border: '2px solid #1976d2'
              }}>
                <img 
                  src={imagePreview} 
        
                  style={{ 
                    width: '100%', 
                    height: '100%'
                 
                  }} 
                />
              </Box>
            )}
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component="label"
                variant="contained"
                sx={{ 
                  borderRadius: 4,
          
                }}
              >
                {selectedImage ? 'Change Image' : 'Choose Image'}
                <input
                  type="file"
                
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </Button>
              
              {selectedImage && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleRemoveImage}
                  sx={{ 
                    borderRadius: 4,
                 
                  }}
                >
                  Remove Image
                </Button>
              )}
            </Box>
            
            {selectedImage && (
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                Selected: {selectedImage.name}
              </Typography>
            )}
            
            {imageError && (
              <Alert severity="error" sx={{ borderRadius: 2, mt: 2 }}>
                {imageError}
              </Alert>
            )}
          </Box>
        )
      
      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600, textAlign: 'center' }}>
              Review Your Information
            </Typography>
            
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Personal Information</Typography>
              <Typography><strong>First Name:</strong> {formData.firstName}</Typography>
              <Typography><strong>Last Name:</strong> {formData.lastName}</Typography>
              <Typography><strong>Gender:</strong> {formData.gender}</Typography>
            </Paper>
            
            {imagePreview && (
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Profile Image</Typography>
                <Box sx={{ 
                  width: 150, 
                  height: 150, 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  border: '1px solid #ddd',
                  mx: 'auto'
                }}>
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }} 
                  />
                </Box>
              </Paper>
            )}
            
            {showSuccess && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                Success! Registration completed.
              </Alert>
            )}
          </Box>
        )
      
      default:
        return null
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', width: '100%', mt: 4, p: 2 }}>
      <Paper 
        elevation={12} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          border: '1px solid #f0e4e4ff'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#251515ff', 
            fontWeight: 600,
            textAlign: 'center',
            mb: 4
          }}
        >
          Registration Form
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
           {steps.map((label) => (
    <Step>
      <StepLabel>{label}</StepLabel>  
    </Step>
  ))}

        </Stepper>

        <Box sx={{ minHeight: 300, mb: 4 }}>
          {renderStepContent()}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{ borderRadius: 3, px: 3 }}
          >
            Back
          </Button>
          
          {activeStep === 2 ? (
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              sx={{ borderRadius: 3, px: 4 }}
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ borderRadius: 3, px: 3 }}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default Reg