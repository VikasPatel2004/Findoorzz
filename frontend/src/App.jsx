import './App.css'

import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import Footer from "./components/Footer"

function App() {

  return (
    <BrowserRouter>
      <Navbar/>
      <HomePage/>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
