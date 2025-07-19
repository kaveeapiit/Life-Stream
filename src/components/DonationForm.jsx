import React, { useState } from 'react';

export default function DonationForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    bloodType: '',
    message: '',
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <form onSubmit={handleSubmit} className="w-full max-w-lg bg-red-50 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-black mb-6">Donation Form</h2>

      {/* Success/Error Messages */}
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

      <div className="mb-4">
        <label htmlFor="name" className="block text-black font-semibold mb-2">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-red-300 text-black rounded focus:outline-none focus:border-red-500"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-black font-semibold mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-red-300 text-black rounded focus:outline-none focus:border-red-500"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="bloodType" className="block text-black font-semibold mb-2">
          Blood Type
        </label>
        <select
          id="bloodType"
          name="bloodType"
          value={form.bloodType}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-red-300 text-black rounded focus:outline-none focus:border-red-500"
          required
        >
          <option value="">Select</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-black font-semibold mb-2">
          Message (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-red-300 text-black rounded focus:outline-none focus:border-red-500"
          rows="4"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Submitting...' : 'Submit Donation'}
      </button>
    </form>
  );
}
