import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';

import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/footer') // Make sure this route returns { phone, email, address }
      .then(res => res.json())
      .then(data => {
        console.log('Footer data fetched:', data);
        setFooterData(data);
      })
      .catch(err => {
        console.error('Failed to fetch footer data:', err);
      });
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer footer={footerData} />
    </Router>
  );
}

export default App;
