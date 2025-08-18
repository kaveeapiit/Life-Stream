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
import RecipientApproval from './hospital/pages/RecipientApproval';

import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import HospitalLogin from './hospital/pages/HospitalLogin';
import HospitalDashboard from './hospital/pages/HospitalDashboard';
import DonorApproval from './hospital/pages/DonorApproval';
import AvailableDonors from './hospital/pages/AvailableDonors';
import Users from './admin/pages/Users';
import Hospitals from './admin/pages/Hospitals.jsx';

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
    '/admin/hospitals',
    '/admin/users',
  ];

  const hideFooterPaths = [
    '/admin/login',
    '/admin/dashboard',
    '/hospital/login',
    '/hospital/dashboard',
    '/hospital/donor-approval',
    '/hospital/available-donors',
    '/profile',
    '/UserDashboard',
    '/hospital/recipient-approval',
    '/admin/users',
    '/admin/hospitals',
  ];

  const shouldHideLayout = hideLayoutPaths.includes(location.pathname);
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/footer`)
      .then((res) => res.json())
      .then((data) => setFooterData(data))
      .catch((err) => console.error('Footer fetch failed:', err));
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
        <Route path="/hospital/recipient-approval" element={<RecipientApproval />} />
        <Route path="/admin/users" element={<Users />} />

        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/user" element={<UserDashboard />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/hospitals" element={<Hospitals />} />

        <Route path="/hospital/login" element={<HospitalLogin />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/donor-approval" element={<DonorApproval />} />
        <Route path="/hospital/available-donors" element={<AvailableDonors />} />
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
