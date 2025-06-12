import './App.css'

import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'

function App() {

  return (
    <BrowserRouter>
      <Navbar/>
      <HomePage/>
    </BrowserRouter>
  )
}

export default App
