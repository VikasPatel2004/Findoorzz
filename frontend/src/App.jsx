import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HomePage from "./pages/HomePage/HomePage";
import Footer from './components/Footer';
import PgPage from './pages/PG/PGPage';
import FlatPage from './pages/Flat/FlatPage';
import LandlordPage from './pages/PG/Landlord/LandlordPage';
import StudentPage from './pages/PG/Student/StudentPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/PG" element={<PgPage/>} />
        <Route path="/Flat" element={<FlatPage/>} />
        <Route path="/Landlord" element={<LandlordPage/>} />
        <Route path="/Student" element={<StudentPage/>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
