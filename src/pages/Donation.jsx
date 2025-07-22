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
    const bloodType = localStorage.getItem('bloodType');
    if (token && name && email) {
      setIsLoggedIn(true);
      setForm(prev => ({ ...prev, name, email, bloodType: bloodType || '' }));
    }
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
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
        setForm(f => ({ ...f, location: '' }));
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-96 h-96 bg-red-600/25 blur-3xl rounded-full absolute -top-24 -left-24 animate-pulse" />
        <div className="w-80 h-80 bg-red-500/20 blur-3xl rounded-full absolute bottom-0 right-0" />
      </div>

      <div className="relative w-full max-w-xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-10 shadow-2xl animate-fadeIn">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold leading-tight">
            Donate Blood. <span className="text-red-400">Save Lives.</span>
          </h1>
          <p className="text-gray-300 mt-2 text-sm">
            Confirm your details and choose the nearest blood bank.
          </p>
        </header>

        {/* status */}
        {status.message && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
              status.type === 'success'
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <FloatInput
            label="Full Name"
            name="name"
            value={form.name}
            readOnly
          />

          {/* Email */}
          <FloatInput
            type="email"
            label="Email"
            name="email"
            value={form.email}
            readOnly
          />

          {/* Blood type */}
          <div className="relative">
            <div className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-sm text-gray-200">
              {form.bloodType || 'N/A'}
            </div>
            <span className="absolute left-4 -top-2 bg-gray-900 px-2 text-xs text-red-400">
              Blood Type
            </span>
          </div>

          {/* Location */}
          <div className="relative">
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition"
            >
              <option value="">Select Location</option>
              <option value="Colombo National Blood Bank">Colombo National Blood Bank</option>
              <option value="Kandy General Hospital">Kandy General Hospital</option>
              <option value="Galle Teaching Hospital">Galle Teaching Hospital</option>
              <option value="Jaffna Hospital">Jaffna Hospital</option>
              <option value="Kurunegala Hospital">Kurunegala Hospital</option>
              <option value="Badulla Hospital">Badulla Hospital</option>
              <option value="Anuradhapura Hospital">Anuradhapura Hospital</option>
            </select>
            <span className="absolute left-4 -top-2 bg-gray-900 px-2 text-xs text-red-400">
              Nearest Blood Bank
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || !isLoggedIn}
            className={`w-full py-3 rounded-lg font-semibold tracking-wide shadow transition
              ${isLoggedIn ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-500 cursor-not-allowed'}
              ${loading && 'opacity-60 cursor-not-allowed'}`}
          >
            {isLoggedIn ? (loading ? 'Submitting…' : 'Submit Donation') : 'Please login'}
          </button>

          {/* progress bar when loading */}
          {loading && (
            <div className="w-full h-1 bg-gray-700 rounded overflow-hidden mt-2">
              <div className="h-full bg-red-500 animate-loadingBar" />
            </div>
          )}
        </form>
      </div>

      {/* animation css */}
      <style>{`
        @keyframes fadeIn { from {opacity:0; transform: translateY(6px);} to {opacity:1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn .4s ease forwards; }
        @keyframes loadingBar { 0%{transform:translateX(-100%);} 100%{transform:translateX(100%);} }
        .animate-loadingBar { animation: loadingBar 1.2s linear infinite; }
      `}</style>
    </div>
  );
}

/* Floating label input */
function FloatInput({ label, name, value, onChange, type = 'text', readOnly = false }) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder=" "
        className={`w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-sm text-white placeholder-transparent
        focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition
        ${readOnly && 'opacity-70 cursor-not-allowed'}`}
        required={!readOnly}
      />
      <label
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none transition-all
        ${value ? 'top-1 text-xs text-red-400' : ''}`}
      >
        {label}
      </label>
    </div>
  );
}
