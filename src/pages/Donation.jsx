import React, { useState, useEffect } from 'react';

export default function Donation() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    bloodType: '',
    message: '',
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
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
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus({ type: 'success', message: '🎉 Thank you for your donation!' });
        setForm({ name: '', email: '', bloodType: '', message: '' });
      } else {
        const errorData = await res.json();
        setStatus({ type: 'error', message: errorData.error || 'Something went wrong.' });
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
        Your donation can help save a life. Fill in the form below to make a contribution to our life-saving efforts.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-red-50 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-black mb-6">Donation Form</h2>

        {/* Success/Error Message */}
        {status.message && (
          <div
            className={`mb-4 p-3 rounded ${
              status.type === 'success'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-black font-semibold mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-red-300 text-black rounded focus:outline-none focus:border-red-500"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-black font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-red-300 text-black rounded focus:outline-none focus:border-red-500"
            required
          />
        </div>

        {/* Blood Type - Animated Cards */}
        <div className="mb-4">
          <label className="block text-black font-semibold mb-2">Blood Type</label>
          <div className="grid grid-cols-4 gap-2">
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((type) => (
              <label
                key={type}
                className={`cursor-pointer px-4 py-2 rounded border text-center font-bold transition-all duration-300 ${
                  form.bloodType === type
                    ? 'bg-red-600 text-white border-red-600 scale-105'
                    : 'bg-white text-black border-red-300 hover:bg-red-100'
                }`}
              >
                <input
                  type="radio"
                  name="bloodType"
                  value={type}
                  onChange={handleChange}
                  className="hidden"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Message (Optional)</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-red-300 text-black rounded focus:outline-none focus:border-red-500"
            rows="4"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !isLoggedIn}
          className={`w-full ${
            isLoggedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400'
          } text-white py-2 rounded transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoggedIn ? (loading ? 'Submitting...' : 'Submit Donation') : 'Please login to submit'}
        </button>
      </form>
    </div>
  );
}
