import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Login response:", data); // ✅ Debugging

      if (res.ok && data.token && data.user) {
        alert("Login successful!");

        // ✅ Store user info in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("bloodType", data.user.blood_type || ''); // ✅ Store blood type

        // ✅ Navigate to user dashboard
        navigate('/user');

        // ✅ Optional reload for UI update
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        alert(data.error || "Login failed.");
      }
    } catch (err) {
      alert("Login error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md text-center">
        {/* 🔴 Logo & Title */}
        <div className="mb-6">
          <div className="w-14 h-14 mx-auto mb-2">
            <img src="/favicon.png" alt="Life Stream Logo" />
          </div>
          <h1 className="text-red-600 text-xl font-bold">LIFE STREAM</h1>
          <p className="text-sm text-gray-500 -mt-1">Blood Donation Management</p>
        </div>

        {/* 🔒 Login Form */}
        <form onSubmit={handleSubmit} className="text-left space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="your@email.com"
                required
                className="w-full pl-10 pr-4 py-2 border border-red-200 rounded-md bg-red-50 text-black focus:outline-none focus:ring-2 focus:ring-red-400"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <FaEnvelope className="absolute top-2.5 left-3 text-red-400" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter your password"
                required
                className="w-full pl-10 pr-4 py-2 border border-red-200 rounded-md bg-red-50 text-black focus:outline-none focus:ring-2 focus:ring-red-400"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <FaLock className="absolute top-2.5 left-3 text-red-400" />
            </div>
            <div className="text-right">
              <a href="#" className="text-xs text-red-500 font-medium hover:underline">Forgot Password?</a>
            </div>
          </div>

          {/* Submit Login */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded shadow hover:bg-red-700 transition"
          >
            <FaSignInAlt /> Login
          </button>

          {/* Link to Register */}
          <a
            href="/register"
            className="w-full flex items-center justify-center gap-2 border border-red-600 text-red-600 py-2 rounded hover:bg-red-50 transition"
          >
            <FaUserPlus /> Register
          </a>
        </form>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-6">
          For assistance, contact <a href="mailto:support@bloodlink.com" className="text-red-500 underline">support@bloodlink.com</a>
        </p>
      </div>
    </div>
  );
}
