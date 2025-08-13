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
import EditPGListingForm from './pages/PG/Landlord/EditPGListingForm';
import EditFlatListingForm from './pages/Flat/Lender/EditFlatListingForm';
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
import UserProfile from './pages/Profile/UserProfile';
import EditProfile from './pages/Profile/EditProfile';
import TestComponent from './components/TestComponent';
import LenderDashboardPage from './pages/Flat/Lender/LenderDashboardPage';
import NotificationCenter from './pages/Notifications/NotificationCenter';
import About from './components/About';

// Payment Management Pages
import PaymentForm from './pages/PaymentManagement/PaymentForm';
import PaymentHistory from './pages/PaymentManagement/PaymentHistory';
import PaymentStatus from './pages/PaymentManagement/PaymentStatus';

// Legal Pages
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsOfService from './pages/Legal/TermsOfService';
import RefundPolicy from './pages/Legal/RefundPolicy';
import CancellationPolicy from './pages/Legal/CancellationPolicy';
// import BusinessInfo from './pages/Legal/BusinessInfo';

import { AuthProvider } from './context/AuthContext';
import { SavedListingsProvider } from './context/SavedListingsContext';
import PrivateRoute from './components/PrivateRoute';
import AdminPanel from './components/Admin/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <SavedListingsProvider>
        <div className="App">
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/Signup" element={<SignupPage />} />
              <Route path="/LoginPage" element={<LoginPage />} />
              <Route path="/test" element={<TestComponent />} />
              <Route path="/about" element={<About />} />

              {/* Legal Pages (Public) */}
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/cancellation-policy" element={<CancellationPolicy />} />
              {/* <Route path="/business-info" element={<BusinessInfo />} /> */}

              {/* PG Routes */}
              <Route path="/PG" element={
                <PrivateRoute>
                  <PgPage />
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
              <Route path="/edit-pg-listing/:id" element={
                <PrivateRoute>
                  <EditPGListingForm />
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

              {/* Flat Routes */}
              <Route path="/Flat" element={
                <PrivateRoute>
                  <FlatPage />
                </PrivateRoute>
              } />
              <Route path="/Lender" element={
                <PrivateRoute>
                  <LenderPage />
                </PrivateRoute>
              } />
              <Route path="/LenderForm" element={
                <PrivateRoute>
                  <LenderListingForm />
                </PrivateRoute>
              } />
              <Route path="/edit-flat-listing/:id" element={
                <PrivateRoute>
                  <EditFlatListingForm />
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
              <Route path="/FlatDetails/:id" element={
                <PrivateRoute>
                  <RenterListingDetailPage />
                </PrivateRoute>
              } />

              {/* Broker Routes */}
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

              {/* Dashboard Routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/RenterDashboard" element={
                <PrivateRoute>
                  <RenterDashboard />
                </PrivateRoute>
              } />
              <Route path="/LenderDashboard" element={
                <PrivateRoute>
                  <LenderDashboardPage />
                </PrivateRoute>
              } />

              {/* Profile Routes */}
              <Route path="/profile" element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              } />
              <Route path="/edit-profile" element={
                <PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
              } />

              {/* Payment Routes */}
              <Route path="/payment/:bookingId" element={
                <PrivateRoute>
                  <PaymentForm />
                </PrivateRoute>
              } />
              <Route path="/payment-history" element={
                <PrivateRoute>
                  <PaymentHistory />
                </PrivateRoute>
              } />
              <Route path="/payment-status/:order_id" element={
                <PrivateRoute>
                  <PaymentStatus />
                </PrivateRoute>
              } />

              {/* Notification Routes */}
              <Route path="/notifications" element={
                <PrivateRoute>
                  <NotificationCenter />
                </PrivateRoute>
              } />

              {/* Admin Panel Route */}
              <Route path="/admin" element={
                <PrivateRoute>
                  <AdminPanel />
                </PrivateRoute>
              } />
            </Routes>
            <Footer />
          </BrowserRouter>
        </div>
      </SavedListingsProvider>
    </AuthProvider>
  );
}

export default App;
