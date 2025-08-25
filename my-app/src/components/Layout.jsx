import { Container, Typography, Box, CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import AddTransaction from './AddTransaction'
import TransactionList from './TransactionList'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#031527ff',
    },
  },
})

function Layout() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            💰 Expense Tracker
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Track your income and expenses
          </Typography>
        </Box>

        <AddTransaction />
        <TransactionList />
      </Container>
    </ThemeProvider>
  )
}

export default Layout