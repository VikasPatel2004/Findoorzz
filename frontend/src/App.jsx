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
import Dashboard from './pages/Dashboard';
import RenterDashboard from './pages/RenterDashboard';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Signup" element={<SignupPage />} />
          <Route path="/LoginPage" element={<LoginPage />} />

          <Route path="/PG" element={
            <PrivateRoute>
              <PgPage />
            </PrivateRoute>
          } />
          <Route path="/Flat" element={
            <PrivateRoute>
              <FlatPage />
            </PrivateRoute>
          } />
          <Route path="/Landlord" element={
            <PrivateRoute>
              <LandlordPage />
            </PrivateRoute>
          } />
          <Route path="/LandlordForm" element={
            <PrivateRoute>
              <LandlordListingForm />
            </PrivateRoute>
          } />
          <Route path="/Student" element={
            <PrivateRoute>
              <StudentPage />
            </PrivateRoute>
          } />
          <Route path="/StudentSavedRooms" element={
            <PrivateRoute>
              <StudentSavedListings />
            </PrivateRoute>
          } />
          <Route path="/RoomDetail/:id" element={
            <PrivateRoute>
              <StudentListingDetailPage />
            </PrivateRoute>
          } />
          <Route path="/Lender" element={
            <PrivateRoute>
              <LenderPage />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/LenderForm" element={
            <PrivateRoute>
              <LenderListingForm />
            </PrivateRoute>
          } />
          <Route path="/Renter" element={
            <PrivateRoute>
              <RenterPage />
            </PrivateRoute>
          } />
          <Route path="/RenterSavedFlats" element={
            <PrivateRoute>
              <RenterSavedListings />
            </PrivateRoute>
          } />

           <Route path="/FlatDetail/:id" element={
            <PrivateRoute>
              <RenterListingDetailPage />
            </PrivateRoute>
          } />

          <Route path="/RenterDashboard" element={
            <PrivateRoute>
              <RenterDashboard />
            </PrivateRoute>
          } />
          <Route path="/BrokerRegistration" element={
            <PrivateRoute>
              <BrokerRegistrationPage />
            </PrivateRoute>
          } />
          <Route path="/BrokerDashboard" element={
            <PrivateRoute>
              <BrokerDashboardPage />
            </PrivateRoute>
          } />
          <Route path="/BrokerAssignment" element={
            <PrivateRoute>
              <BrokerAssignmentPage />
            </PrivateRoute>
          } />
          <Route path="/FlatDetails" element={
            <PrivateRoute>
              <RenterListingDetailPage />
            </PrivateRoute>
          } />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
