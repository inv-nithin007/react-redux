import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AddTransaction from './components/AddTransaction'
import TransactionList from './components/TransactionList'
import Charts from './components/Charts'
import Reg from './components/Reg'

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
        <Route path="/registration" element={<Reg />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App