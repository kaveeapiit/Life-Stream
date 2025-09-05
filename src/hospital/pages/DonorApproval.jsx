import { useEffect, useState } from 'react';
import HospitalSidebar from '../components/HospitalSidebar';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaHistory, FaClock, FaVial } from 'react-icons/fa';
import hospitalAPI from '../../config/hospitalAPI.js';

export default function DonorApproval() {
  const [donations, setDonations] = useState([]);
  const [history, setHistory] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'

  // Fetch all donations (pending first, then approved/declined)
  useEffect(() => {
    fetchAllDonations();
    fetchDonationHistory();
  }, []);

  const fetchAllDonations = async () => {
    setLoading(true);
    try {
      const data = await hospitalAPI.getAllDonations();
      
      if (data) {
        console.log('All donations:', data);
        
        if (Array.isArray(data)) {
          // Separate pending from others for better UX
          const pending = data.filter(d => d.status === 'Pending');
          setDonations(pending);
        } else {
          setDonations([]);
        }
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
      const data = await hospitalAPI.getDonationHistory();
      
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

  const updateStatus = async (id, status) => {
    try {
      const updated = await hospitalAPI.updateDonationStatus(id, status);
      
      if (updated) {
        // Remove from pending donations and refresh history
        setDonations(prev => prev.filter(d => d.id !== updated.id));
        fetchDonationHistory(); // Refresh history to show the newly processed donation
        
        console.log(`Donation ${id} updated to ${status}`);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating status');
    }
  };

  // Filter based on current tab
  const currentData = activeTab === 'pending' ? donations : history;
  const filtered = currentData.filter(d =>
    [d.name, d.email, d.blood_type, d.location || ''].join(' ').toLowerCase().includes(q.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Pending': 'bg-yellow-600/30 text-yellow-300',
      'Approved': 'bg-green-600/30 text-green-300', 
      'Declined': 'bg-red-600/30 text-red-300',
      'Collected': 'bg-blue-600/30 text-blue-300'
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || 'bg-gray-600/30 text-gray-300'}`}>
        {status === 'Pending' && <FaClock />}
        {status === 'Approved' && <FaCheckCircle />}
        {status === 'Declined' && <FaTimesCircle />}
        {status === 'Collected' && <FaVial />}
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <HospitalSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-8 md:p-12 overflow-hidden">
        {/* Title + Search */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight">Donation Management</h1>
          
          <div className="relative w-full sm:w-80">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search donations..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 transition"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex bg-gray-800/40 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === 'pending' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <FaClock />
            Pending Approvals ({donations.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === 'history' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <FaHistory />
            History ({history.length})
          </button>
        </div>

        {/* Glass container */}
        <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto max-h-[70vh]">
            <table className="w-full text-sm">
              <thead className="bg-white/10 sticky top-0 z-10">
                <tr className="text-left text-gray-200">
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Blood Type</Th>
                  <Th>Location</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                  {activeTab === 'pending' && <Th className="text-center">Actions</Th>}
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'pending' ? loading : historyLoading) && (
                  <tr>
                    <td colSpan={activeTab === 'pending' ? "7" : "6"} className="px-4 py-6 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                )}

                {!(activeTab === 'pending' ? loading : historyLoading) && filtered.length === 0 && (
                  <tr>
                    <td colSpan={activeTab === 'pending' ? "7" : "6"} className="px-4 py-6 text-center text-gray-400">
                      {activeTab === 'pending' ? 'No pending donations.' : 'No donation history.'}
                    </td>
                  </tr>
                )}

                {filtered.map((d, i) => (
                  <tr
                    key={d.id}
                    className="border-t border-white/5 hover:bg-white/5 transition-all duration-200 animate-fadeIn"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <Td>{d.name}</Td>
                    <Td>{d.email}</Td>
                    <Td>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-red-600/30 text-red-300 text-xs font-semibold">
                        {d.blood_type}
                      </span>
                    </Td>
                    <Td>{d.location || 'Not specified'}</Td>
                    <Td>{getStatusBadge(d.status)}</Td>
                    <Td>{new Date(d.created_at).toLocaleDateString()}</Td>
                    {activeTab === 'pending' && (
                      <Td className="text-center space-x-2">
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-600 hover:bg-green-500 text-white text-xs font-medium transition"
                          onClick={() => updateStatus(d.id, 'Approved')}
                        >
                          <FaCheckCircle /> Approve
                        </button>
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition"
                          onClick={() => updateStatus(d.id, 'Declined')}
                        >
                          <FaTimesCircle /> Decline
                        </button>
                      </Td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-white/10 max-h-[70vh] overflow-y-auto">
            {(activeTab === 'pending' ? loading : historyLoading) && (
              <p className="px-4 py-6 text-center text-gray-400">Loading...</p>
            )}
            {!(activeTab === 'pending' ? loading : historyLoading) && filtered.length === 0 && (
              <p className="px-4 py-6 text-center text-gray-400">
                {activeTab === 'pending' ? 'No pending donations.' : 'No donation history.'}
              </p>
            )}
            {filtered.map((d, i) => (
              <div
                key={d.id}
                className="p-4 space-y-2 animate-fadeIn"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{d.name}</h3>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-0.5 rounded-full bg-red-600/30 text-red-300 text-xs font-semibold">
                      {d.blood_type}
                    </span>
                    {getStatusBadge(d.status)}
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{d.email}</p>
                <p className="text-gray-400 text-xs">{d.location || 'Location not specified'}</p>
                <p className="text-gray-400 text-xs">{new Date(d.created_at).toLocaleDateString()}</p>

                {activeTab === 'pending' && (
                  <div className="pt-2 flex gap-2">
                    <button
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition"
                      onClick={() => updateStatus(d.id, 'Approved')}
                    >
                      <FaCheckCircle /> Approve
                    </button>
                    <button
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition"
                      onClick={() => updateStatus(d.id, 'Declined')}
                    >
                      <FaTimesCircle /> Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn .3s ease forwards; }
      `}</style>
    </div>
  );
}

function Th({ children, className = '' }) {
  return (
    <th className={`px-4 py-3 font-semibold ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = '' }) {
  return (
    <td className={`px-4 py-2 ${className}`}>
      {children}
    </td>
  );
}
