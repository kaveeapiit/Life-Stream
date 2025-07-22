import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FindBlood() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    blood_type: '',
    location: '',
    urgency: false,
  });

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    if (name || email) {
      setIsLoggedIn(true);
      setForm((prev) => ({ ...prev, name: name || '', email: email || '' }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('Please log in first to submit a request.');
      navigate('/login');
      return;
    }

    const res = await fetch('http://localhost:5000/api/blood/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      navigate('/pending-requests');
    } else {
      alert('Failed to submit request');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-white text-black py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-xl p-8 border border-red-200">
        <h1 className="text-4xl font-extrabold text-center text-red-700 mb-8">Request Blood</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              name="name"
              placeholder="Your Name"
              onChange={handleChange}
              value={form.name}
              required
              disabled={!isLoggedIn}
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
              value={form.email}
              required
              disabled={!isLoggedIn}
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Blood Type</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              name="blood_type"
              onChange={handleChange}
              required
              disabled={!isLoggedIn}
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Location</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              name="location"
              placeholder="Colombo, Kandy..."
              onChange={handleChange}
              disabled={!isLoggedIn}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="urgency"
              className="w-5 h-5 text-red-600"
              onChange={handleChange}
              disabled={!isLoggedIn}
            />
            <span className="ml-3 font-semibold text-red-700">Mark as Urgent</span>
          </div>

          <button
            type="submit"
            disabled={!isLoggedIn}
            className={`w-full font-bold py-3 rounded-lg transition duration-200 ${
              isLoggedIn
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
          >
            {isLoggedIn ? 'Submit Request' : 'Login to Submit'}
          </button>
        </form>

        {!isLoggedIn && (
          <p className="mt-4 text-center text-red-600 font-semibold">
            Please log in to submit a blood request.
          </p>
        )}
      </div>
    </div>
  );
}
