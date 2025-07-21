import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// General pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Donation from './pages/Donation';
import UserDashboard from './pages/UserDashboard';
import FindBlood from './pages/FindBlood';
import Profile from './pages/Profile';

// Admin pages
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';

// Hospital pages
import HospitalLogin from './hospital/pages/HospitalLogin';
import HospitalDashboard from './hospital/pages/HospitalDashboard';
import DonorApproval from './hospital/pages/DonorApproval';

// Shared components
import Header from './components/Header';
import Footer from './components/Footer';

function AppWrapper() {
  const location = useLocation();
  const [footerData, setFooterData] = useState(null);

  // Routes where HEADER is hidden
  const hideLayoutPaths = [
    '/admin/login',
    '/admin/dashboard',
    '/hospital/login',
    '/hospital/dashboard',
    '/hospital/donor-approval',
  ];

  // Routes where FOOTER is hidden
  const hideFooterPaths = [
    '/admin/login',
    '/admin/dashboard',
    '/hospital/login',
    '/hospital/dashboard',
    '/hospital/donor-approval',
    '/profile', // ✅ Hides footer on Profile page
    '/UserDashboard',
  ];

  const shouldHideLayout = hideLayoutPaths.includes(location.pathname);
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  useEffect(() => {
    fetch('http://localhost:5000/api/footer')
      .then((res) => res.json())
      .then((data) => setFooterData(data))
      .catch((err) => console.error('Footer fetch failed:', err));
  }, []);

  return (
    <>
      {!shouldHideLayout && <Header />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/donate" element={<Donation />} />
        <Route path="/find-blood" element={<FindBlood />} />
        <Route path="/profile" element={<Profile />} />

        {/* User Routes */}
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/user" element={<UserDashboard />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Hospital Routes */}
        <Route path="/hospital/login" element={<HospitalLogin />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/donor-approval" element={<DonorApproval />} />
      </Routes>

      {/* ✅ Only hide footer when shouldHideFooter is true */}
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
