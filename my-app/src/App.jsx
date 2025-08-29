import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AddTransaction from './components/AddTransaction'
import TransactionList from './components/TransactionList'
import Charts from './components/Charts'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div>
            <AddTransaction />
            <TransactionList />
          </div>
        } />
        <Route path="/charts" element={<Charts />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App