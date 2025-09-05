import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaHistory, FaClock, FaVial } from 'react-icons/fa';
import adminAPI from '../../config/adminAPI.js';

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [history, setHistory] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'

  // Fetch all donations and history
  useEffect(() => {
    fetchAllDonations();
    fetchDonationHistory();
  }, []);

  const fetchAllDonations = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getAllDonations();
      
      console.log('All donations:', data);
      
      if (Array.isArray(data)) {
        // Separate pending from others for better UX
        const pending = data.filter(d => d.status === 'Pending');
        setDonations(pending);
      } else {
        setDonations([]);
      }
    } catch (err) {
      console.error('Failed to fetch all donations', err);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDonationHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await adminAPI.getDonationHistory();
      
      console.log('Donation history:', data);
      
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error('Failed to fetch donation history', err);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleApproveOrDecline = async (donationId, status) => {
    try {
      const result = await adminAPI.updateDonationStatus(donationId, status);

      if (result) {
        // Refresh both lists
        await fetchAllDonations();
        await fetchDonationHistory();
        
        console.log(`Donation ${status.toLowerCase()}d successfully`);
      }
    } catch (err) {
      console.error(`Error ${status.toLowerCase()}ing donation:`, err);
      alert(`Failed to ${status.toLowerCase()} donation. Please try again.`);
    }
  };

  // Filter donations based on search query
  const filteredDonations = donations.filter(donation =>
    donation.name?.toLowerCase().includes(q.toLowerCase()) ||
    donation.email?.toLowerCase().includes(q.toLowerCase()) ||
    donation.blood_type?.toLowerCase().includes(q.toLowerCase()) ||
    donation.location?.toLowerCase().includes(q.toLowerCase())
  );

  const filteredHistory = history.filter(donation =>
    donation.name?.toLowerCase().includes(q.toLowerCase()) ||
    donation.email?.toLowerCase().includes(q.toLowerCase()) ||
    donation.blood_type?.toLowerCase().includes(q.toLowerCase()) ||
    donation.location?.toLowerCase().includes(q.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      'Approved': 'bg-green-100 text-green-800 border border-green-300',
      'Declined': 'bg-red-100 text-red-800 border border-red-300',
      'Collected': 'bg-blue-100 text-blue-800 border border-blue-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <AdminSidebar />
      
      <div className="flex-1 ml-0 md:ml-64 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="w-96 h-96 bg-indigo-600/25 blur-3xl rounded-full absolute -top-24 -left-24 animate-pulse" />
          <div className="w-80 h-80 bg-purple-500/20 blur-3xl rounded-full absolute bottom-0 right-0" />
        </div>

        <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fadeIn">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600/80 shadow-lg">
                <FaVial className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  Donation <span className="text-indigo-400">Management</span>
                </h1>
                <p className="text-gray-300 text-sm md:text-base">Manage all blood donation requests</p>
              </div>
            </div>
          </header>

          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search by name, email, blood type, or location..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-xl"
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-white/10 p-1 rounded-xl backdrop-blur-xl border border-white/20">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'pending'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaClock className="text-lg" />
                <span>Pending Donations ({filteredDonations.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaHistory className="text-lg" />
                <span>History ({filteredHistory.length})</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'pending' && (
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                  <FaClock className="text-indigo-400" />
                  Pending Donations
                </h2>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
              ) : filteredDonations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <FaVial className="text-6xl mb-4 opacity-50" />
                  <p className="text-xl">No pending donations found</p>
                  <p className="text-sm">All donation requests have been processed</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {filteredDonations.map((donation) => (
                    <div key={donation.id} className="p-6 hover:bg-white/5 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-white">{donation.name}</h3>
                            <span className="px-3 py-1 bg-indigo-600/30 text-indigo-300 rounded-full text-xs font-medium">
                              {donation.blood_type}
                            </span>
                            {getStatusBadge(donation.status)}
                          </div>
                          <div className="text-gray-300 space-y-1">
                            <p className="flex items-center gap-2">
                              <span className="text-gray-400">Email:</span>
                              <span>{donation.email}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-gray-400">Location:</span>
                              <span>{donation.location || 'Not specified'}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-gray-400">Submitted:</span>
                              <span>{formatDate(donation.created_at)}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApproveOrDecline(donation.id, 'Approved')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                          >
                            <FaCheckCircle />
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproveOrDecline(donation.id, 'Declined')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                          >
                            <FaTimesCircle />
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                  <FaHistory className="text-indigo-400" />
                  Donation History
                </h2>
              </div>

              {historyLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <FaHistory className="text-6xl mb-4 opacity-50" />
                  <p className="text-xl">No donation history found</p>
                  <p className="text-sm">No donations have been processed yet</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {filteredHistory.map((donation) => (
                    <div key={donation.id} className="p-6 hover:bg-white/5 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-white">{donation.name}</h3>
                            <span className="px-3 py-1 bg-indigo-600/30 text-indigo-300 rounded-full text-xs font-medium">
                              {donation.blood_type}
                            </span>
                            {getStatusBadge(donation.status)}
                          </div>
                          <div className="text-gray-300 space-y-1">
                            <p className="flex items-center gap-2">
                              <span className="text-gray-400">Email:</span>
                              <span>{donation.email}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-gray-400">Location:</span>
                              <span>{donation.location || 'Not specified'}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-gray-400">Processed:</span>
                              <span>{formatDate(donation.created_at)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Animation styles */}
        <style>{`
          @keyframes fadeIn { 
            from { opacity: 0; transform: translateY(8px); } 
            to { opacity: 1; transform: translateY(0); } 
          }
          .animate-fadeIn { 
            animation: fadeIn 0.4s ease forwards; 
          }
        `}</style>
      </div>
    </div>
  );
}
