import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await fetch('http://life-stream-production-2f47.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.user.name);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('bloodType', data.user.blood_type || '');
        navigate('/user');
        setTimeout(() => window.location.reload(), 100);
      } else {
        setErr(data.error || 'Login failed.');
      }
    } catch {
      setErr('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* blobs */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="w-96 h-96 bg-red-600/30 blur-3xl rounded-full absolute -top-24 -left-24 animate-pulse" />
        <div className="w-80 h-80 bg-red-500/20 blur-3xl rounded-full absolute bottom-0 right-0" />
      </div>

      {/* card */}
      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-10 shadow-2xl animate-fadeIn">
        {/* logo + title */}
        <div className="mb-6 text-center">
          <div className="w-14 h-14 mx-auto mb-3">
            <img src="/favicon.png" alt="Life Stream Logo" className="w-full h-full" />
          </div>
          <h1 className="text-red-400 text-2xl font-extrabold tracking-wide">LIFE STREAM</h1>
          <p className="text-xs text-gray-300 mt-1">Blood Donation Management</p>
        </div>

        {/* error */}
        {err && (
          <div className="mb-4 px-4 py-2 rounded-md bg-red-500/20 border border-red-500/40 text-red-200 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* email */}
          <StaticInput
            icon={<FaEnvelope className="text-red-400" />}
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />

          {/* password */}
          <div className="relative">
            <StaticInput
              icon={<FaLock className="text-red-400" />}
              label="Password"
              type={showPw ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-[52px] -translate-y-1/2 text-gray-400 hover:text-gray-200"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <FaEyeSlash /> : <FaEye />}
            </button>
            <div className="text-right mt-1">
              <a href="#" className="text-xs text-red-300 hover:underline">Forgot Password?</a>
            </div>
          </div>

          {/* login */}
          <MagneticBtn
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg font-semibold shadow-lg shadow-red-700/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FaSignInAlt /> {loading ? 'Logging in…' : 'Login'}
          </MagneticBtn>

          {/* register */}
          <a
            href="/register"
            className="w-full flex items-center justify-center gap-2 border border-red-500 text-red-300 py-3 rounded-lg hover:bg-red-500/10 transition font-semibold"
          >
            <FaUserPlus /> Register
          </a>
        </form>

        <p className="text-[10px] text-gray-400 mt-6 text-center">
          Need help? <a href="mailto:support@bloodlink.com" className="text-red-300 underline">support@bloodlink.com</a>
        </p>
      </div>

      {/* styles */}
      <style>{`
        @keyframes fadeIn { from {opacity:0; transform: translateY(8px);} to {opacity:1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn .4s ease forwards; }

        /* Chrome autofill fix */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px rgba(17,24,39,0.5) inset !important;
          -webkit-text-fill-color: #fff !important;
          caret-color: #fff;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}

/* ---- Static label input (no floating) ---- */
function StaticInput({ icon, label, value, name, type = 'text', onChange, required }) {
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
