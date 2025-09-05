import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaHistory, FaClock, FaHeartbeat, FaExclamationTriangle } from 'react-icons/fa';
import adminAPI from '../../config/adminAPI.js';

export default function AdminBloodRequests() {
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'

  // Fetch all blood requests and history
  useEffect(() => {
    fetchAllRequests();
    fetchRequestHistory();
  }, []);

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getAllBloodRequests();
      
      console.log('All blood requests:', data);
      
      if (Array.isArray(data)) {
        // Separate pending from others for better UX
        const pending = data.filter(r => r.status === 'pending');
        setRequests(pending);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error('Failed to fetch all blood requests', err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await adminAPI.getBloodRequestHistory();
      
      console.log('Blood request history:', data);
      
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error('Failed to fetch blood request history', err);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleApproveOrDecline = async (requestId, approved) => {
    try {
      const result = await adminAPI.updateBloodRequestApproval(requestId, approved);

      if (result) {
        // Refresh both lists
        await fetchAllRequests();
        await fetchRequestHistory();
        
        console.log(`Blood request ${approved ? 'approved' : 'declined'} successfully`);
      }
    } catch (err) {
      console.error(`Error ${approved ? 'approving' : 'declining'} blood request:`, err);
      alert(`Failed to ${approved ? 'approve' : 'decline'} blood request. Please try again.`);
    }
  };

  // Filter requests based on search query
  const filteredRequests = requests.filter(request =>
    request.name?.toLowerCase().includes(q.toLowerCase()) ||
    request.email?.toLowerCase().includes(q.toLowerCase()) ||
    request.blood_type?.toLowerCase().includes(q.toLowerCase()) ||
    request.location?.toLowerCase().includes(q.toLowerCase())
  );

  const filteredHistory = history.filter(request =>
    request.name?.toLowerCase().includes(q.toLowerCase()) ||
    request.email?.toLowerCase().includes(q.toLowerCase()) ||
    request.blood_type?.toLowerCase().includes(q.toLowerCase()) ||
    request.location?.toLowerCase().includes(q.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const styles = {
      'pending': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      'approved': 'bg-green-100 text-green-800 border border-green-300',
      'declined': 'bg-red-100 text-red-800 border border-red-300',
      'fulfilled': 'bg-blue-100 text-blue-800 border border-blue-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const getUrgencyBadge = (urgencyLevel) => {
    if (urgencyLevel === 'High') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 border border-red-300 rounded-full text-xs font-semibold">
          <FaExclamationTriangle className="text-xs" />
          Urgent
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded-full text-xs font-semibold">
        Normal
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

  const formatHoursAgo = (hoursAgo) => {
    if (hoursAgo < 1) return 'Less than 1 hour ago';
    if (hoursAgo < 24) return `${Math.floor(hoursAgo)} hours ago`;
    const days = Math.floor(hoursAgo / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <AdminSidebar />
      
      <div className="flex-1 ml-0 md:ml-64 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="w-96 h-96 bg-red-600/25 blur-3xl rounded-full absolute -top-24 -left-24 animate-pulse" />
          <div className="w-80 h-80 bg-pink-500/20 blur-3xl rounded-full absolute bottom-0 right-0" />
        </div>

        <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fadeIn">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600/80 shadow-lg">
                <FaHeartbeat className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  Blood <span className="text-red-400">Requests</span>
                </h1>
                <p className="text-gray-300 text-sm md:text-base">Manage all blood request submissions</p>
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
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 backdrop-blur-xl"
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-white/10 p-1 rounded-xl backdrop-blur-xl border border-white/20">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'pending'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaClock className="text-lg" />
                <span>Pending Requests ({filteredRequests.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-red-600 text-white shadow-lg'
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
                  <FaClock className="text-red-400" />
                  Pending Blood Requests
                </h2>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-8 h-8 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <FaHeartbeat className="text-6xl mb-4 opacity-50" />
                  <p className="text-xl">No pending blood requests found</p>
                  <p className="text-sm">All blood requests have been processed</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="p-6 hover:bg-white/5 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-semibold text-white">{request.name}</h3>
                            <span className="px-3 py-1 bg-red-600/30 text-red-300 rounded-full text-xs font-medium">
                              {request.blood_type}
                            </span>
                            {getStatusBadge(request.status)}
                            {getUrgencyBadge(request.urgency_level)}
                          </div>
                          <div className="text-gray-300 space-y-1">
                            <p className="flex items-center gap-2">
                              <span className="text-gray-400">Email:</span>
                              <span>{request.email}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-gray-400">Location:</span>
                              <span>{request.location || 'Not specified'}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-gray-400">Submitted:</span>
                              <span>{formatDate(request.created_at)}</span>
                              <span className="text-xs text-gray-500">
                                ({formatHoursAgo(request.hours_ago)})
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApproveOrDecline(request.id, true)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                          >
                            <FaCheckCircle />
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproveOrDecline(request.id, false)}
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
                  <FaHistory className="text-red-400" />
                  Blood Request History
                </h2>
              </div>

              {historyLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-8 h-8 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <FaHistory className="text-6xl mb-4 opacity-50" />
                  <p className="text-xl">No blood request history found</p>
                  <p className="text-sm">No blood requests have been processed yet</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {filteredHistory.map((request) => (
                    <div key={request.id} className="p-6 hover:bg-white/5 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-semibold text-white">{request.name}</h3>
                            <span className="px-3 py-1 bg-red-600/30 text-red-300 rounded-full text-xs font-medium">
                              {request.blood_type}
                            </span>
                            {getStatusBadge(request.status)}
                            {getUrgencyBadge(request.urgency_level)}
                          </div>
                          <div className="text-gray-300 space-y-1">
                            <p className="flex items-center gap-2">
                              <span className="text-gray-400">Email:</span>
                              <span>{request.email}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-gray-400">Location:</span>
                              <span>{request.location || 'Not specified'}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-gray-400">Processed:</span>
                              <span>{formatDate(request.created_at)}</span>
                              <span className="text-xs text-gray-500">
                                ({formatHoursAgo(request.hours_ago)})
                              </span>
                            </p>
                            {request.assigned_hospital && (
                              <p className="flex items-center gap-2">
                                <span className="text-gray-400">Hospital:</span>
                                <span>{request.assigned_hospital}</span>
                              </p>
                            )}
                            {request.hospital_notes && (
                              <p className="flex items-center gap-2">
                                <span className="text-gray-400">Notes:</span>
                                <span className="text-sm">{request.hospital_notes}</span>
                              </p>
                            )}
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
