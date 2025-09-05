import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import hospitalAPI from '../../config/hospitalAPI.js';

export default function HospitalLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await hospitalAPI.login(form.username, form.password);
      
      if (result.success) {
        navigate('/hospital/dashboard');
      } else {
        alert(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Server error:', err);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Glow blob */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="w-96 h-96 bg-red-600/30 rounded-full blur-3xl absolute -top-24 -left-24 animate-pulse" />
        <div className="w-80 h-80 bg-red-400/20 rounded-full blur-3xl absolute bottom-0 right-0" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl animate-fadeIn">
        <h2 className="text-3xl font-extrabold text-center mb-2">Hospital Login</h2>
        <p className="text-center text-gray-300 mb-8 text-sm">Access your approval panel</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed transition font-semibold tracking-wide shadow"
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>

      {/* tiny animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn .35s ease forwards; }
      `}</style>
    </div>
  );
}

/* Reusable input */
function Input({ type, placeholder, value, onChange }) {
  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition"
      />
    </div>
  );
}
