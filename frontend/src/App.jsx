import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HomePage from "./pages/HomePage/HomePage";
import Footer from './components/Footer';
import PgPage from './pages/PG/PGPage';
import FlatPage from './pages/Flat/FlatPage';
import LandlordPage from './pages/PG/Landlord/LandlordPage';
import StudentPage from './pages/PG/Student/StudentPage';
import LenderPage from './pages/Flat/Lender/LenderPage';
import RenterPage from './pages/Flat/Renter/RenterPage';
import LandlordListingForm from './pages/PG/Landlord/LandlordListingForm';
import LenderListingForm from './pages/Flat/Lender/LenderListingForm';
import StudentListingDetailPage from './pages/PG/Student/StudentListingFullPage';
import RenterListingDetailPage from './pages/Flat/Renter/RenterListingDetailPage';
import SignupPage from './pages/HomePage/SignupPage';
import BrokerRegistrationPage from './pages/Flat/Broker/BrokerPage';
import BrokerDashboardPage from './pages/Flat/Broker/BrokerDashboardPage';
import BrokerAssignmentPage from './pages/Flat/Broker/BrokerAssignmentPage';
import RenterSavedListings from './pages/Flat/Renter/RenterSavedListings';
import StudentSavedListings from './pages/PG/Student/StudentSavedListings';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/PG" element={<PgPage/>} />
        <Route path="/Flat" element={<FlatPage/>} />
        <Route path="/Signup" element={<SignupPage/>} />
        <Route path="/LoginPage" element={<LoginPage/>} />
        <Route path="/Landlord" element={<LandlordPage/>} />
        <Route path="/LandlordForm" element={<LandlordListingForm/>} />
        <Route path="/Student" element={<StudentPage/>} /> 
        <Route path="/StudentSavedRooms" element={<StudentSavedListings/>} /> 
        <Route path="/RoomDetail" element={<StudentListingDetailPage/>} />
        <Route path="/Lender" element={<LenderPage/>} />
        <Route path="/LenderForm" element={<LenderListingForm/>} />
        <Route path="/Renter" element={<RenterPage/>} />
        <Route path="/RenterSavedFlats" element={<RenterSavedListings/>} />
        <Route path='/BrokerRegistration' element={<BrokerRegistrationPage/>} />
        <Route path='/BrokerDashboard' element={<BrokerDashboardPage/>} />
        <Route path="/BrokerAssignment" element={<BrokerAssignmentPage/>} />
        <Route path="/FlatDetails" element={<RenterListingDetailPage/>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
