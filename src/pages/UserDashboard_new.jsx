import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api.js';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('donor');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [donations, setDonations] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({ name: '', bloodType: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!token) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    // Fetch user profile and both donation and blood request history
    Promise.all([
      fetch(`${API_BASE_URL}/api/user/profile/${email}`),
      fetch(`${API_BASE_URL}/api/donation/user/${email}`),
      fetch(`${API_BASE_URL}/api/blood/user?email=${email}`)
    ])
    .then(([profileRes, donationsRes, requestsRes]) => 
      Promise.all([profileRes.json(), donationsRes.json(), requestsRes.json()])
    )
    .then(([profileData, donationsData, requestsData]) => {
      setUser(profileData);
      setProfileData({ name: profileData.name || '', bloodType: profileData.blood_type || '' });
      setDonations(Array.isArray(donationsData) ? donationsData : []);
      setBloodRequests(Array.isArray(requestsData) ? requestsData : []);
    })
    .catch(err => console.error('Fetch error:', err))
    .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profileData, email: localStorage.getItem('email') }),
      });
      const result = await res.json();
      setMessage(result.message || 'Profile updated successfully!');
      
      if (result.success) {
        setUser(u => ({ ...u, name: profileData.name, blood_type: profileData.bloodType }));
        localStorage.setItem('name', profileData.name);
        localStorage.setItem('bloodType', profileData.bloodType);
      }
    } catch (err) {
      setMessage('Failed to update profile');
    } finally {
      setIsUpdating(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/profile/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: localStorage.getItem('email'), 
          newPassword: passwordData.newPassword 
        }),
      });
      const result = await res.json();
      setMessage(result.message || 'Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage('Failed to update password');
    } finally {
      setIsUpdating(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* New Sidebar */}
      <ModernSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        onLogout={handleLogout}
        user={user}
      />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-x-hidden">
        {/* Message Alert */}
        {message && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slideIn">
            {message}
          </div>
        )}

        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <DashboardSection 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            donations={donations}
            bloodRequests={bloodRequests}
            user={user}
          />
        )}

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <ProfileSection
            user={user}
            profileData={profileData}
            setProfileData={setProfileData}
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            onProfileUpdate={handleProfileUpdate}
            onPasswordUpdate={handlePasswordUpdate}
            isUpdating={isUpdating}
          />
        )}
      </main>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn .35s ease forwards; }
        .animate-slideIn { animation: slideIn .3s ease forwards; }
      `}</style>
    </div>
  );
}

/* ---- Modern Sidebar Component ---- */
function ModernSidebar({ activeSection, setActiveSection, onLogout, user }) {
  const sidebarItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z"/>
        </svg>
      )
    },
    { 
      id: 'profile', 
      label: 'My Profile', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 z-40">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">LifeStream</h1>
            <p className="text-xs text-gray-400">Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-white">{user?.name || 'User'}</h3>
            <p className="text-sm text-gray-400">{user?.blood_type || 'N/A'} • {user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

/* ---- Dashboard Section Component ---- */
function DashboardSection({ activeTab, setActiveTab, donations, bloodRequests, user }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome back, <span className="text-red-400">{user?.name || 'User'}</span>
        </h1>
        <p className="text-gray-300 text-lg">
          Manage your donations and blood requests from your personalized dashboard
        </p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Donations"
          value={donations.length}
          icon={
            <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          }
          subtitle="Blood donations made"
        />
        <StatCard
          title="Blood Requests"
          value={bloodRequests.length}
          icon={
            <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          }
          subtitle="Requests submitted"
        />
        <StatCard
          title="Lives Impacted"
          value={donations.filter(d => d.status === 'Approved').length * 3}
          icon={
            <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          }
          subtitle="Estimated lives saved"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex bg-white/10 p-1 rounded-2xl backdrop-blur-sm border border-white/20">
          <TabButton
            active={activeTab === 'donor'}
            onClick={() => setActiveTab('donor')}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            }
            label="Donor History"
          />
          <TabButton
            active={activeTab === 'recipient'}
            onClick={() => setActiveTab('recipient')}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            }
            label="Recipient History"
          />
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8">
        {activeTab === 'donor' ? (
          <DonorHistoryTable donations={donations} />
        ) : (
          <RecipientHistoryTable bloodRequests={bloodRequests} />
        )}
      </div>
    </div>
  );
}

/* ---- Profile Section Component ---- */
function ProfileSection({ 
  user, 
  profileData, 
  setProfileData, 
  passwordData, 
  setPasswordData, 
  onProfileUpdate, 
  onPasswordUpdate, 
  isUpdating 
}) {
  const [activeProfileTab, setActiveProfileTab] = useState('personal');

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold mb-4">My Profile</h1>
        <p className="text-gray-300 text-lg">
          Manage your personal information and account settings
        </p>
      </header>

      {/* Profile Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex bg-white/10 p-1 rounded-2xl backdrop-blur-sm border border-white/20">
          <TabButton
            active={activeProfileTab === 'personal'}
            onClick={() => setActiveProfileTab('personal')}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            }
            label="Personal Info"
          />
          <TabButton
            active={activeProfileTab === 'security'}
            onClick={() => setActiveProfileTab('security')}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10.5V11.5C15.4,11.5 16,12.4 16,13V16C16,17 15.4,17.5 14.8,17.5H9.2C8.6,17.5 8,17 8,16V13C8,12.4 8.6,11.5 9.2,11.5V10.5C9.2,8.6 10.6,7 12,7Z"/>
              </svg>
            }
            label="Security"
          />
        </div>
      </div>

      {/* Profile Content */}
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8">
        {activeProfileTab === 'personal' ? (
          <PersonalInfoForm
            user={user}
            profileData={profileData}
            setProfileData={setProfileData}
            onSubmit={onProfileUpdate}
            isUpdating={isUpdating}
          />
        ) : (
          <SecurityForm
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            onSubmit={onPasswordUpdate}
            isUpdating={isUpdating}
          />
        )}
      </div>
    </div>
  );
}

/* ---- Small Components ---- */
function StatCard({ title, value, icon, subtitle }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>{icon}</div>
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{subtitle}</p>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
        active
          ? 'bg-red-600 text-white shadow-lg'
          : 'text-gray-300 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function DonorHistoryTable({ donations }) {
  if (donations.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <h3 className="text-xl font-semibold text-gray-400 mb-2">No Donations Yet</h3>
        <p className="text-gray-500">Start your journey as a blood donor today!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Donation History</h2>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white/10 rounded-t-xl">
            <tr className="text-left text-gray-200">
              <Th>Location</Th>
              <Th>Blood Type</Th>
              <Th>Date</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d, i) => (
              <tr
                key={d.id || i}
                className="border-t border-white/5 hover:bg-white/5 transition animate-fadeIn"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <Td>{d.location || '—'}</Td>
                <Td>{d.blood_type}</Td>
                <Td>{new Date(d.created_at).toLocaleString()}</Td>
                <Td>
                  <StatusChip status={d.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid gap-4">
        {donations.map((d, i) => (
          <div
            key={d.id || i}
            className="rounded-xl bg-gray-900/60 border border-white/10 p-5 shadow-lg animate-fadeIn"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <Row label="Location" value={d.location || '—'} />
            <Row label="Blood Type" value={d.blood_type} />
            <Row label="Date" value={new Date(d.created_at).toLocaleString()} />
            <Row label="Status" value={<StatusChip status={d.status} />} />
          </div>
        ))}
      </div>
    </div>
  );
}

function RecipientHistoryTable({ bloodRequests }) {
  if (bloodRequests.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        <h3 className="text-xl font-semibold text-gray-400 mb-2">No Blood Requests</h3>
        <p className="text-gray-500">You haven't submitted any blood requests yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Blood Request History</h2>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white/10 rounded-t-xl">
            <tr className="text-left text-gray-200">
              <Th>Patient Name</Th>
              <Th>Blood Type</Th>
              <Th>Location</Th>
              <Th>Urgency</Th>
              <Th>Date</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {bloodRequests.map((r, i) => (
              <tr
                key={r.id || i}
                className="border-t border-white/5 hover:bg-white/5 transition animate-fadeIn"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <Td>{r.name || '—'}</Td>
                <Td>{r.blood_type}</Td>
                <Td>{r.location || '—'}</Td>
                <Td>
                  <UrgencyChip urgency={r.urgency || r.urgency_level} />
                </Td>
                <Td>{new Date(r.created_at).toLocaleString()}</Td>
                <Td>
                  <StatusChip status={r.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid gap-4">
        {bloodRequests.map((r, i) => (
          <div
            key={r.id || i}
            className="rounded-xl bg-gray-900/60 border border-white/10 p-5 shadow-lg animate-fadeIn"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <Row label="Patient" value={r.name || '—'} />
            <Row label="Blood Type" value={r.blood_type} />
            <Row label="Location" value={r.location || '—'} />
            <Row label="Urgency" value={<UrgencyChip urgency={r.urgency || r.urgency_level} />} />
            <Row label="Date" value={new Date(r.created_at).toLocaleString()} />
            <Row label="Status" value={<StatusChip status={r.status} />} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonalInfoForm({ user, profileData, setProfileData, onSubmit, isUpdating }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Personal Information</h3>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            label="Full Name"
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your full name"
          />
          
          <FormField
            label="Blood Type"
            type="select"
            value={profileData.bloodType}
            onChange={(e) => setProfileData(prev => ({ ...prev, bloodType: e.target.value }))}
            options={[
              { value: '', label: 'Select Blood Type' },
              { value: 'A+', label: 'A+' },
              { value: 'A-', label: 'A-' },
              { value: 'B+', label: 'B+' },
              { value: 'B-', label: 'B-' },
              { value: 'AB+', label: 'AB+' },
              { value: 'AB-', label: 'AB-' },
              { value: 'O+', label: 'O+' },
              { value: 'O-', label: 'O-' }
            ]}
          />
        </div>
        
        <FormField
          label="Email Address"
          type="email"
          value={user?.email || ''}
          disabled={true}
        />
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

function SecurityForm({ passwordData, setPasswordData, onSubmit, isUpdating }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Security Settings</h3>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <FormField
          label="New Password"
          type="password"
          value={passwordData.newPassword}
          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
          placeholder="Enter new password"
        />
        
        <FormField
          label="Confirm New Password"
          type="password"
          value={passwordData.confirmPassword}
          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          placeholder="Confirm new password"
        />
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({ label, type = 'text', value, onChange, placeholder, disabled = false, options = [] }) {
  if (type === 'select') {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">{label}</label>
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {options.map(option => (
            <option key={option.value} value={option.value} className="bg-gray-800">
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-300 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

/* ---- Shared Table Components ---- */
function Th({ children }) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}

function Td({ children }) {
  return <td className="px-4 py-3">{children}</td>;
}

function StatusChip({ status }) {
  const map = {
    Pending: 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/30',
    Approved: 'bg-green-600/30 text-green-300 border border-green-400/30',
    Declined: 'bg-red-600/30 text-red-300 border border-red-400/30',
    pending: 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/30',
    approved: 'bg-green-600/30 text-green-300 border border-green-400/30',
    declined: 'bg-red-600/30 text-red-300 border border-red-400/30',
    fulfilled: 'bg-blue-600/30 text-blue-300 border border-blue-400/30',
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-500/30 text-gray-200 border border-gray-400/30'}`}>
      {status}
    </span>
  );
}

function UrgencyChip({ urgency }) {
  const isUrgent = urgency === true || urgency === 'High' || urgency === 'high' || urgency === 'urgent';
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
      isUrgent 
        ? 'bg-red-600/30 text-red-300 border border-red-400/30' 
        : 'bg-green-600/30 text-green-300 border border-green-400/30'
    }`}>
      {isUrgent ? 'Urgent' : 'Normal'}
    </span>
  );
}

function Row({ label, value }) {
  return (
    <p className="mb-2 text-sm">
      <span className="font-semibold text-gray-300">{label}:</span>{' '}
      <span className="text-gray-200">{value}</span>
    </p>
  );
}
