import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

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
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isLoggedIn) return navigate('/login');

    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch('http://life-stream-production-2f47.up.railway.app/api/blood/request', {
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

  const bloodOptions = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

  const locationOptions = [
    'Colombo National Blood Bank',
    'Kandy General Hospital',
    'Galle Teaching Hospital',
    'Jaffna Hospital',
    'Kurunegala Hospital',
    'Badulla Hospital',
    'Anuradhapura Hospital'
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-96 h-96 bg-red-600/25 blur-3xl rounded-full absolute -top-24 -left-24 animate-pulse" />
        <div className="w-80 h-80 bg-red-500/20 blur-3xl rounded-full absolute bottom-0 right-0" />
      </div>

      <div className="relative w-full max-w-xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-10 shadow-2xl animate-fadeIn">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Request <span className="text-red-400">Blood</span>
          </h1>
          <p className="text-gray-300 mt-2 text-sm">Fill the form below to notify nearby hospitals.</p>
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

        <form onSubmit={handleSubmit} className="space-y-8 relative">
          <UnderInput label="Full Name" name="name" value={form.name} readOnly />
          <UnderInput label="Email Address" name="email" type="email" value={form.email} readOnly />

          {/* Blood Type Dropdown */}
          <DarkSelect
            label="Blood Type"
            name="blood_type"
            value={form.blood_type}
            onChange={handleChange}
            placeholder="Select Blood Type"
            options={bloodOptions}
            disabled={!isLoggedIn}
            required
          />

          {/* Nearest Blood Bank Dropdown */}
          <DarkSelect
            label="Nearest Blood Bank"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Select Location"
            options={locationOptions}
            disabled={!isLoggedIn}
            required
          />

          {/* Urgency Toggle */}
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
                ${!isLoggedIn && 'opacity-50 cursor-not-allowed'}`}
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
        @keyframes fadeIn { from {opacity:0; transform: translateY(6px);} to {opacity:1; transform:translateY(0);} }
        .animate-fadeIn { animation: fadeIn .45s ease forwards; }
        @keyframes loadingBar { 0%{transform:translateX(-100%);} 100%{transform:translateX(100%);} }
        .animate-loadingBar { animation: loadingBar 1.2s linear infinite; }
      `}</style>
    </div>
  );
}

/* ---------- Underline Input Field ---------- */
const baseInput = "w-full bg-transparent text-white/90 text-base font-medium py-3 focus:outline-none";
const underline = "border-b border-white/20 focus:border-red-500 transition-colors duration-200";
const labelCls = "block text-sm font-semibold text-white/70 mb-1";

function UnderInput({ label, name, value, onChange, type = "text", readOnly = false, disabled = false, required }) {
  return (
    <div className="relative">
      <label htmlFor={name} className={labelCls}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        required={required}
        placeholder={label}
        className={`${baseInput} ${underline} ${disabled || readOnly ? "opacity-60 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}

/* ---------- DarkSelect (Styled Dropdown) ---------- */
function DarkSelect({ label, name, value, onChange, options, placeholder, disabled = false, required = false }) {
  return (
    <div className="relative">
      <label htmlFor={name} className={labelCls}>{label}</label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full bg-transparent text-white/90 text-base font-medium py-3 pl-0 pr-8
                    ${underline} outline-none appearance-none rounded-none
                    ${disabled && 'opacity-60 cursor-not-allowed'}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>

      {/* caret icon */}
      <svg
        className="pointer-events-none absolute right-0 top-[38px] w-4 h-4 text-white/60"
        fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>

      <style>{`
        select option { background-color:#111827; color:#ffffff; }
        select::-ms-expand { display:none; }
        select { -webkit-appearance:none; -moz-appearance:none; appearance:none; background-image:none!important; }
      `}</style>
    </div>
  );
}
