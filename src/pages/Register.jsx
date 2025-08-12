import { useState, useRef } from 'react';
import { FaEnvelope, FaLock, FaUser, FaUserPlus, FaSignInAlt, FaTint, FaEye, FaEyeSlash } from 'react-icons/fa';
import bloodLogo from '../assets/blooddrop.svg';


export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', bloodType: '' });
  const [showPw, setShowPw] = useState(false);
  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const calcStrength = pw => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErr(''); setOk(''); setLoading(true);
    try {
      const res = await fetch('http://localhost:5050/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setOk(data.message || 'Registered successfully!');
        setTimeout(() => (window.location.href = '/login'), 900);
      } else setErr(data.error || 'Registration failed.');
    } catch {
      setErr('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* blobs */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-red-600/30 blur-3xl rounded-full absolute -top-16 -left-16 sm:-top-24 sm:-left-24 animate-pulse" />
        <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-red-500/20 blur-3xl rounded-full absolute bottom-0 right-0" />
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl animate-fadeIn my-8">
        {/* Logo */}
        <div className="mb-6 text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3">
            <img src={bloodLogo} alt="Life Stream Logo" className="w-full h-full" />
          </div>
          <h1 className="text-red-400 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wide">LIFE STREAM</h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">Blood Donation Management</p>
        </div>

        {/* alerts */}
        {err && <Alert type="error">{err}</Alert>}
        {ok && <Alert type="success">{ok}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <StaticInput
            icon={<FaUser className="text-red-400" />}
            label="Full Name"
            name="name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />

          <StaticInput
            icon={<FaEnvelope className="text-red-400" />}
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />

          {/* Password with strength */}
          <div className="space-y-2">
            <div className="relative">
              <StaticInput
                icon={<FaLock className="text-red-400" />}
                label="Password"
                name="password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => {
                  const pw = e.target.value;
                  setForm({ ...form, password: pw });
                  setStrength(calcStrength(pw));
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-[40px] sm:top-[46px] -translate-y-1/2 text-gray-400 hover:text-gray-200 p-1 touch-manipulation"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {form.password && <StrengthBar level={strength} />}
          </div>

          {/* Blood Type */}
          <StaticSelect
            icon={<FaTint className="text-red-400" />}
            label="Blood Type"
            name="bloodType"
            value={form.bloodType}
            onChange={e => setForm({ ...form, bloodType: e.target.value })}
            options={['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bt => ({ value: bt, label: bt }))}
            placeholder="Select your blood type"
            required
          />

          <MagneticBtn
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white py-3 sm:py-4 rounded-lg font-semibold shadow-lg shadow-red-700/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
          >
            <FaUserPlus /> {loading ? 'Registering…' : 'Register'}
          </MagneticBtn>

          <a
            href="/login"
            className="w-full flex items-center justify-center gap-2 border border-red-500 text-red-300 py-3 sm:py-4 rounded-lg hover:bg-red-500/10 transition font-semibold text-sm sm:text-base touch-manipulation"
          >
            <FaSignInAlt /> Login
          </a>
        </form>

        <p className="text-[10px] sm:text-xs text-gray-400 mt-4 sm:mt-6 text-center">
          Need help? <a href="mailto:support@bloodlink.com" className="text-red-300 underline">support@bloodlink.com</a>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn { from {opacity:0; transform: translateY(8px);} to {opacity:1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn .4s ease forwards; }
      `}</style>
    </div>
  );
}

/* ---------- Reusable components ---------- */

function StaticInput({ icon, label, name, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label htmlFor={name} className="block mb-1 text-sm font-semibold text-gray-300">{label}</label>
      <div className="relative">
        <span className="absolute top-1/2 -translate-y-1/2 left-3">{icon}</span>
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={label}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700
                     text-base font-semibold text-white placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition"
        />
      </div>
    </div>
  );
}

function StaticSelect({ icon, label, name, value, onChange, options, placeholder, required }) {
  return (
    <div>
      <label htmlFor={name} className="block mb-1 text-sm font-semibold text-gray-300">{label}</label>
      <div className="relative">
        <span className="absolute top-1/2 -translate-y-1/2 left-3">{icon}</span>
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full pl-10 pr-8 py-3 rounded-lg bg-gray-900/50 border border-gray-700
                     text-base font-semibold text-white appearance-none
                     focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(o => (
            <option key={o.value} value={o.value} className="text-black">
              {o.label}
            </option>
          ))}
        </select>
        {/* caret icon */}
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

function StrengthBar({ level }) {
  const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  return (
    <div className="h-1 w-full bg-gray-700/40 rounded overflow-hidden">
      <div
        className={`h-full ${colors[level - 1] || 'bg-red-500'} transition-all`}
        style={{ width: `${(level / 4) * 100}%` }}
      />
    </div>
  );
}

function Alert({ type }) {
  const cls = type === 'error'
    ? 'bg-red-500/20 border-red-500/40 text-red-200'
    : 'bg-green-500/20 border-green-500/40 text-green-200';
  return (
    <div className={`mb-4 px-4 py-2 rounded-md border text-sm ${cls}`}>
      
    </div>
  );
}

/* Magnetic button */
function MagneticBtn({ children, className = '', ...rest }) {
  const ref = useRef(null);
  const onMove = e => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * 0.06}px, ${y * 0.06}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = 'translate(0,0)'; };
  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}
