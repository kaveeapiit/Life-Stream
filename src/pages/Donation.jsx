import React, { useState, useEffect } from 'react';

export default function Donation() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    bloodType: '',
    location: ''
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const bloodType = localStorage.getItem('bloodType'); // 🔁 Store this during login

    if (token && name && email) {
      setIsLoggedIn(true);
      setForm(prev => ({
        ...prev,
        name,
        email,
        bloodType: bloodType || ''
      }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return;

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('http://localhost:5000/api/donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: '🎉 Donation registered!' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-6">Donate Blood. Save Lives.</h1>
      <p className="text-gray-700 max-w-2xl text-center mb-8">
        Your donation can help save a life. Please confirm your details and choose a location.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-red-50 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-black mb-6">Donation Form</h2>

        {/* Success/Error Message */}
        {status.message && (
          <div className={`mb-4 p-3 rounded ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status.message}
          </div>
        )}

        {/* Name (Read-Only) */}
        <div className="mb-4">
          <label className="block text-black font-semibold mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 text-black rounded bg-gray-100"
          />
        </div>

        {/* Email (Read-Only) */}
        <div className="mb-4">
          <label className="block text-black font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 text-black rounded bg-gray-100"
          />
        </div>

        {/* Blood Type - Show as Label */}
        <div className="mb-4">
          <label className="block text-black font-semibold mb-2">Blood Type</label>
          <div className="w-full px-4 py-2 border border-gray-300 text-black rounded bg-gray-100">
            {form.bloodType || 'N/A'}
          </div>
        </div>

        {/* 🔁 Blood Bank Location Dropdown */}
        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Nearest Blood Bank Location</label>
          <select
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-red-300 text-black rounded focus:outline-none focus:border-red-500"
          >
            <option value="">Select Location</option>
            <option value="Colombo National Blood Bank">Colombo</option>
            <option value="Kandy General Hospital">Kandy</option>
            <option value="Galle Teaching Hospital">Galle</option>
            <option value="Jaffna Hospital">Jaffna</option>
            <option value="Kurunegala Hospital">Kurunegala</option>
            <option value="Badulla Hospital">Badulla</option>
            <option value="Anuradhapura Hospital">Anuradhapura</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !isLoggedIn}
          className={`w-full ${isLoggedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400'} text-white py-2 rounded transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoggedIn ? (loading ? 'Submitting...' : 'Submit Donation') : 'Please login'}
        </button>
      </form>
    </div>
  );
}
