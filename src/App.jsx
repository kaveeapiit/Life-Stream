import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import API_BASE_URL from './config/api.js';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Donation from './pages/Donation';
import UserDashboard from './pages/UserDashboard';
import FindBlood from './pages/FindBlood';
import Profile from './pages/Profile';
import PendingRequests from './pages/PendingRequests';

import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import HospitalLogin from './hospital/pages/HospitalLogin';
import HospitalDashboard from './hospital/pages/HospitalDashboard';
import DonorApproval from './hospital/pages/DonorApproval';
import AvailableDonors from './hospital/pages/AvailableDonors';
import DonorRequestMatching from './hospital/pages/DonorRequestMatching';
import LocationBasedDonorMatching from './hospital/pages/LocationBasedDonorMatching';
import BloodInventory from './hospital/pages/BloodInventory';
import CollectDonation from './hospital/pages/CollectDonation';
import BloodRequests from './hospital/pages/BloodRequests';
import HospitalToHospitalRequests from './hospital/pages/HospitalToHospitalRequests';
import Users from './admin/pages/Users';
import Hospitals from './admin/pages/Hospitals.jsx';
import ManageUsers from './admin/pages/ManageUsers';
import ManageHospitals from './admin/pages/ManageHospitals';
import AdminDonations from './admin/pages/AdminDonations';
import AdminBloodRequests from './admin/pages/AdminBloodRequests';

import Header from './components/Header';
import Footer from './components/Footer';

function AppWrapper() {
  const location = useLocation();
  const [footerData, setFooterData] = useState(null);

  const hideLayoutPaths = [
    '/admin/login',
    '/admin/dashboard',
    '/hospital/login',
    '/hospital/dashboard',
    '/hospital/donor-approval',
    '/hospital/recipient-approval',
    '/hospital/available-donors',
    '/hospital/donor-matching',
    '/hospital/blood-inventory',
    '/hospital/collect-donation',
    '/hospital/blood-requests',
    '/admin/hospitals',
    '/admin/users',
    '/admin/donations',
    '/admin/requests',
  ];

  const hideFooterPaths = [
    '/admin/login',
    '/admin/dashboard',
    '/hospital/login',
    '/hospital/dashboard',
    '/hospital/donor-approval',
    '/hospital/recipient-approval',
    '/hospital/available-donors',
    '/hospital/donor-matching',
    '/hospital/blood-inventory',
    '/hospital/collect-donation',
    '/hospital/blood-requests',
    '/admin/hospitals',
    '/admin/users',
    '/profile',
    '/UserDashboard',
  ];

  const shouldHideLayout = hideLayoutPaths.includes(location.pathname);
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/footer`)
      .then((res) => res.json())
      .then((data) => setFooterData(data))
      .catch(() => {/* Silently handle footer fetch errors */});
  }, []);

  return (
    <>
      {!shouldHideLayout && <Header />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/donate" element={<Donation />} />
        <Route path="/find-blood" element={<FindBlood />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pending-requests" element={<PendingRequests />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/user" element={<UserDashboard />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/hospitals" element={<ManageHospitals />} />
        <Route path="/admin/donations" element={<AdminDonations />} />
        <Route path="/admin/requests" element={<AdminBloodRequests />} />

        <Route path="/hospital/login" element={<HospitalLogin />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/donor-approval" element={<DonorApproval />} />
        <Route path="/hospital/available-donors" element={<AvailableDonors />} />
        <Route path="/hospital/donor-matching" element={<DonorRequestMatching />} />
        <Route path="/hospital/location-matching" element={<LocationBasedDonorMatching />} />
        <Route path="/hospital/blood-inventory" element={<BloodInventory />} />
        <Route path="/hospital/collect-donation" element={<CollectDonation />} />
        <Route path="/hospital/blood-requests" element={<BloodRequests />} />
        <Route path="/hospital/hospital-requests" element={<HospitalToHospitalRequests />} />
      </Routes>

      {!shouldHideFooter && <Footer footer={footerData} />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
