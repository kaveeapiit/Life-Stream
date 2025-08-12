import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function Profile() {
  const email = localStorage.getItem('email');
  const [user, setUser] = useState(null);
  const [editData, setEditData] = useState({ name: '', bloodType: '' });
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5050/api/user/profile/${email}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setEditData({ name: data.name || '', bloodType: data.blood_type || '' });
      })
      .finally(() => setLoading(false));
  }, [email]);

  const showMsg = m => {
    setMsg(m);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleUpdate = async () => {
    const res = await fetch('http://localhost:5050/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editData, email }),
    });
    const result = await res.json();
    showMsg(result.message || 'Updated!');
    if (result.success) {
      setUser(u => ({ ...u, name: editData.name, blood_type: editData.bloodType }));
      localStorage.setItem('name', editData.name);
      localStorage.setItem('bloodType', editData.bloodType);
    }
  };

  const handlePasswordChange = async () => {
    const res = await fetch('http://localhost:5000/api/user/profile/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });
    const result = await res.json();
    showMsg(result.message || 'Password changed!');
    setNewPassword('');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 sm:p-6 lg:p-8 xl:p-12 overflow-x-hidden relative">
        {/* toast */}
        {msg && (
          <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 px-3 sm:px-4 py-2 rounded-md bg-green-500/20 border border-green-400/30 text-green-200 text-sm shadow animate-fadeIn max-w-xs">
            {msg}
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-8 sm:mb-10 flex flex-col items-center text-center">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-4 border-red-500/60 shadow-lg mb-4">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(editData.name || 'User')}&background=ef4444&color=fff`}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-red-400 drop-shadow-sm">
              My Profile
            </h1>
            {user && (
              <p className="text-sm text-gray-300 mt-2 break-all sm:break-normal">{user.email}</p>
            )}
          </header>

          {/* Tabs */}
          <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 justify-center">
            <TabButton active={tab === 'profile'} onClick={() => setTab('profile')}>
              <span className="hidden sm:inline">👤 Profile</span>
              <span className="sm:hidden">👤</span>
            </TabButton>
            <TabButton active={tab === 'password'} onClick={() => setTab('password')}>
              <span className="hidden sm:inline">🔒 Password</span>
              <span className="sm:hidden">🔒</span>
            </TabButton>
          </div>

          <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl min-h-[280px] sm:min-h-[320px] animate-fadeIn">
            {loading ? (
              <Loader />
            ) : tab === 'profile' ? (
              <div className="space-y-6">
                <Field
                  label="Name"
                  name="name"
                  value={editData.name}
                  onChange={e => setEditData({ ...editData, name: e.target.value })}
                />
                <Field
                  label="Blood Type"
                  name="bloodType"
                  value={editData.bloodType}
                  onChange={e => setEditData({ ...editData, bloodType: e.target.value })}
                />

                <button
                  onClick={handleUpdate}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-red-700/30 transition"
                >
                  💾 Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <Field
                  label="New Password"
                  name="password"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <button
                  onClick={handlePasswordChange}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-white font-semibold py-3 rounded-lg shadow-lg shadow-yellow-600/30 transition"
                >
                  🔒 Change Password
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .animate-fadeIn{animation:fadeIn .35s ease forwards}
      `}</style>
    </div>
  );
}

/* ---------- Components ---------- */
function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition
        ${active ? 'bg-red-600 text-white shadow' : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60'}`}
    >
      {children}
    </button>
  );
}

function Field({ label, value, onChange, name, type = 'text' }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-white/70 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg bg-gray-900/60 border border-gray-700 text-sm text-white
                   focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition"
        placeholder={label}
      />
    </div>
  );
}

function Loader() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-gray-700/40 rounded" />
      <div className="h-10 bg-gray-700/40 rounded" />
      <div className="h-10 bg-gray-700/40 rounded" />
    </div>
  );
}
