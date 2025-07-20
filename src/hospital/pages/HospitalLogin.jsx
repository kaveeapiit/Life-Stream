import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HospitalLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/hospital/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      navigate('/hospital/dashboard');
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Hospital Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            required
            className="w-full px-4 py-2 border rounded text-black text-base"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded text-black text-base"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
