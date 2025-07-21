import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function Profile() {
  const email = localStorage.getItem('email');
  const [user, setUser] = useState({});
  const [editData, setEditData] = useState({ name: '', bloodType: '' });
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/api/user/profile/${email}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setEditData({ name: data.name || '', bloodType: data.blood_type || '' });
      });
  }, [email]);

  const handleUpdate = async () => {
    const res = await fetch('http://localhost:5000/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editData, email }),
    });
    const result = await res.json();
    setMsg(result.message);
  };

  const handlePasswordChange = async () => {
    const res = await fetch('http://localhost:5000/api/user/profile/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });
    const result = await res.json();
    setMsg(result.message);
    setNewPassword('');
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">
      <Sidebar />

      <main className="flex-1 ml-64 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          <h1 className="text-4xl font-bold mb-6 text-center text-red-500 drop-shadow-sm">🩸 My Profile</h1>

          {msg && (
            <div className="mb-6 p-3 bg-green-600/10 border border-green-400 rounded text-green-300 text-center">
              {msg}
            </div>
          )}

          {/* Edit Profile Section */}
          <div className="bg-[#1e293b] p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Edit Profile</h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-white">Name</label>
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-600 rounded px-4 py-2 text-white"
                value={editData.name}
                onChange={e => setEditData({ ...editData, name: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-white">Blood Type</label>
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-600 rounded px-4 py-2 text-white"
                value={editData.bloodType}
                onChange={e => setEditData({ ...editData, bloodType: e.target.value })}
              />
            </div>

            <button
              onClick={handleUpdate}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition"
            >
              💾 Save Changes
            </button>
          </div>

          {/* Change Password Section */}
          <div className="bg-[#1e293b] p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-white">Change Password</h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-white">New Password</label>
              <input
                type="password"
                className="w-full bg-slate-800 border border-slate-600 rounded px-4 py-2 text-white"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handlePasswordChange}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded transition"
            >
              🔒 Change Password
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
