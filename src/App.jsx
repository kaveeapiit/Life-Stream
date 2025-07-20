import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// General pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Donation from './pages/Donation';
import UserDashboard from './pages/UserDashboard';

// Admin pages
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';

// Hospital pages ✅ NEW
import HospitalLogin from './hospital/pages/HospitalLogin';
import HospitalDashboard from './hospital/pages/HospitalDashboard';

// Shared components
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/footer')
      .then((res) => res.json())
      .then((data) => {
        console.log('Footer data fetched:', data);
        setFooterData(data);
      })
      .catch((err) => {
        console.error('Failed to fetch footer data:', err);
      });
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/donate" element={<Donation />} />

        {/* User Dashboard */}
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/user" element={<UserDashboard />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* ✅ Hospital Routes */}
        <Route path="/hospital/login" element={<HospitalLogin />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
      </Routes>
      <Footer footer={footerData} />
    </Router>
  );
}

export default App;
