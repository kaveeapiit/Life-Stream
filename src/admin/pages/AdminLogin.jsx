import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, User, Lock, Eye, EyeOff, AlertCircle, LogIn } from "lucide-react";
import adminAPI from '../../config/adminAPI.js';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await adminAPI.login(formData.username, formData.password);
      
      if (result.success) {
        navigate("/admin/dashboard");
      } else {
        setError(result.error || "Invalid credentials");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans text-white">
      {/* BG gradient + blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/30 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/20 blur-3xl rounded-full" />

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md p-10 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl animate-fadeIn"
      >
        {/* Glow border on hover */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity opacity-0 hover:opacity-100">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/40 to-indigo-500/40 blur-xl" />
        </div>

        {/* Logo / title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-600/80 shadow-lg mb-3">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Portal</h1>
          <p className="text-xs text-gray-300 mt-1">Authorized personnel only</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-200 text-sm px-3 py-2 rounded-md">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Username */}
        <Field
          icon={<User className="w-4 h-4 text-red-400" />}
          label="Username"
          name="username"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
        />

        {/* Password */}
        <div className="mt-6 relative">
          <Field
            icon={<Lock className="w-4 h-4 text-red-400" />}
            label="Password"
            name="password"
            type={showPw ? "text" : "password"}
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            noMargin
          />
          <button
            type="button"
            onClick={() => setShowPw(s => !s)}
            className="absolute right-3 top-10 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-10 w-full py-3 rounded-lg bg-red-600 hover:bg-red-500 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-700/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <LogIn size={18} />
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>

      {/* tiny anim */}
      <style>{`
        @keyframes fadeIn { from {opacity:0; transform: translateY(8px);} to {opacity:1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn .4s ease forwards; }
      `}</style>
    </div>
  );
}

/* ----------------- Small components ----------------- */
function Field({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  noMargin = false,
}) {
  return (
    <div className={noMargin ? "" : "mt-6"}>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-200 mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute top-1/2 -translate-y-1/2 left-3">{icon}</span>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/60 border border-gray-700 text-sm text-white
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition"
          required
        />
      </div>
    </div>
  );
}
