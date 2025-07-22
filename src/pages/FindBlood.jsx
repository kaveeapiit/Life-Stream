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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    if (name || email) {
      setIsLoggedIn(true);
      setForm(p => ({ ...p, name: name || '', email: email || '' }));
    }
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch('http://localhost:5000/api/blood/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMsg({ type: 'success', text: '✅ Request submitted!' });
        setForm(f => ({ ...f, blood_type: '', location: '', urgency: false }));
        navigate('/pending-requests');
      } else {
        const data = await res.json();
        setMsg({ type: 'error', text: data.error || 'Failed to submit request.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error. Try again.' });
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
          <h1 className="text-3xl font-extrabold">
            Request <span className="text-red-400">Blood</span>
          </h1>
          <p className="text-gray-300 mt-2 text-sm">
            Fill the form below to notify nearby hospitals.
          </p>
        </header>

        {msg && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
              msg.type === 'success'
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <FloatInput
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            readOnly
          />
          <FloatInput
            type="email"
            label="Email Address"
            name="email"
            value={form.email}
            onChange={handleChange}
            readOnly
          />

          {/* Blood type */}
          <div className="relative">
            <select
              name="blood_type"
              value={form.blood_type}
              onChange={handleChange}
              disabled={!isLoggedIn}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="">Select Blood Type</option>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bt=>(
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
            <span className="absolute left-4 -top-2 bg-gray-900 px-2 text-xs text-red-400">Blood Type</span>
          </div>

          <FloatInput
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            disabled={!isLoggedIn}
          />

          {/* Urgency toggle */}
          <label className="flex items-center gap-3 select-none">
            <input
              type="checkbox"
              name="urgency"
              checked={form.urgency}
              onChange={handleChange}
              disabled={!isLoggedIn}
              className="sr-only"
            />
            <span
              className={`inline-block w-12 h-6 rounded-full transition-all relative
                ${form.urgency ? 'bg-red-600' : 'bg-gray-600'}
                ${!isLoggedIn && 'opacity-50 cursor-not-allowed'}
              `}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                ${form.urgency ? 'translate-x-6' : 'translate-x-0'}`}
              />
            </span>
            <span className="font-semibold text-sm text-red-300">Mark as Urgent</span>
          </label>

          <button
            type="submit"
            disabled={!isLoggedIn || loading}
            className={`w-full py-3 rounded-lg font-semibold tracking-wide shadow transition
              ${isLoggedIn ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-500 cursor-not-allowed'}
              ${loading && 'opacity-60 cursor-not-allowed'}`}
          >
            {isLoggedIn ? (loading ? 'Submitting…' : 'Submit Request') : 'Login to Submit'}
          </button>

          {loading && (
            <div className="w-full h-1 bg-gray-700 rounded overflow-hidden mt-2">
              <div className="h-full bg-red-500 animate-loadingBar" />
            </div>
          )}
        </form>

        {!isLoggedIn && (
          <p className="mt-6 text-center text-red-400 text-sm">
            Please log in to submit a blood request.
          </p>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from {opacity:0; transform: translateY(6px);} to {opacity:1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn .45s ease forwards; }
        @keyframes loadingBar { 0%{transform:translateX(-100%);} 100%{transform:translateX(100%);} }
        .animate-loadingBar { animation: loadingBar 1.2s linear infinite; }
      `}</style>
    </div>
  );
}

/* floating label input */
function FloatInput({ label, name, value, onChange, type = 'text', readOnly = false, disabled = false }) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        readOnly={readOnly}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-sm text-white placeholder-transparent
        focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition
        ${readOnly || disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
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
