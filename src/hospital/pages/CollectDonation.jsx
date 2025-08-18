import { useEffect, useState } from 'react';
import HospitalSidebar from '../components/HospitalSidebar';
import { 
  FaCheckCircle, 
  FaCalendarAlt, 
  FaTint,
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import API_BASE_URL from '../../config/api.js';

export default function CollectDonation() {
  const [approvedDonations, setApprovedDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [convertingId, setConvertingId] = useState(null);

  // Fetch approved donations that haven't been collected yet
  useEffect(() => {
    fetchApprovedDonations();
  }, []);

  const fetchApprovedDonations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/hospital/donations/pending`, {
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to fetch donations');
      
      const data = await res.json();
      // Filter for approved donations only
      const approved = data.filter(donation => donation.status === 'Approved');
      setApprovedDonations(approved);
    } catch (err) {
      console.error('Error fetching approved donations:', err);
      setApprovedDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectDonation = async (donation) => {
    const expiryDate = prompt(
      `Collecting blood from ${donation.name}.\n\nEnter expiry date (YYYY-MM-DD):\n(Blood typically expires 35-42 days after collection)`,
      new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );

    if (!expiryDate) return;

    // Validate date format and ensure it's in the future
    const expiryDateObj = new Date(expiryDate);
    const today = new Date();
    
    if (isNaN(expiryDateObj.getTime())) {
      alert('Invalid date format. Please use YYYY-MM-DD format.');
      return;
    }

    if (expiryDateObj <= today) {
      alert('Expiry date must be in the future.');
      return;
    }

    setConvertingId(donation.id);

    try {
      const res = await fetch(`${API_BASE_URL}/api/hospital/inventory/convert/${donation.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ expiryDate })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to collect donation');
      }

      const result = await res.json();
      alert(`Success! Blood unit added to inventory.\nUnit ID: ${result.bloodUnit.id}`);
      
      // Refresh the list
      fetchApprovedDonations();
    } catch (err) {
      console.error('Error collecting donation:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setConvertingId(null);
    }
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

  const getBloodTypeColor = (bloodType) => {
    const colors = {
      'A+': 'bg-red-500/20 text-red-300 border-red-500/30',
      'A-': 'bg-red-600/20 text-red-400 border-red-600/30',
      'B+': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'B-': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
      'AB+': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'AB-': 'bg-purple-600/20 text-purple-400 border-purple-600/30',
      'O+': 'bg-green-500/20 text-green-300 border-green-500/30',
      'O-': 'bg-green-600/20 text-green-400 border-green-600/30'
    };
    return colors[bloodType] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <HospitalSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-8 md:p-12 overflow-hidden">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Collect Donations</h1>
          <p className="text-gray-300">
            Convert approved donations into blood inventory units
          </p>
        </div>

        {/* Instructions */}
        <div className="mb-6 backdrop-blur-md bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaExclamationTriangle className="text-blue-400" />
            <h3 className="font-semibold text-blue-300">Instructions</h3>
          </div>
          <p className="text-sm text-gray-300">
            Click "Collect Blood" to convert an approved donation into an inventory unit. 
            You'll need to specify the expiry date (typically 35-42 days from collection date).
          </p>
        </div>

        {/* Approved Donations */}
        <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading approved donations...</p>
            </div>
          ) : approvedDonations.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <FaCheckCircle className="mx-auto mb-4 text-4xl opacity-50" />
              <p>No approved donations ready for collection.</p>
              <p className="text-sm mt-2">Donations will appear here after they are approved by hospital staff.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/10 sticky top-0 z-10">
                    <tr className="text-left text-gray-200">
                      <th className="px-4 py-3 font-semibold">Donor</th>
                      <th className="px-4 py-3 font-semibold">Blood Type</th>
                      <th className="px-4 py-3 font-semibold">Location</th>
                      <th className="px-4 py-3 font-semibold">Approved</th>
                      <th className="px-4 py-3 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedDonations.map((donation, i) => (
                      <tr
                        key={donation.id}
                        className="border-b border-white/5 hover:bg-white/5 transition"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FaUser className="text-gray-400 text-xs" />
                              <span className="font-medium text-sm">{donation.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaEnvelope className="text-gray-400 text-xs" />
                              <span className="text-gray-300 text-sm">{donation.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getBloodTypeColor(donation.blood_type)}`}>
                            <FaTint className="text-xs" />
                            {donation.blood_type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-gray-300">
                            <FaMapMarkerAlt className="text-xs" />
                            <span className="text-sm">{donation.location}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-gray-400">
                            <FaCalendarAlt className="text-xs" />
                            <span className="text-sm">{formatDate(donation.created_at)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleCollectDonation(donation)}
                              disabled={convertingId === donation.id}
                              className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-xs font-medium transition flex items-center gap-2"
                            >
                              {convertingId === donation.id ? (
                                <>
                                  <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"></div>
                                  Converting...
                                </>
                              ) : (
                                <>
                                  <FaCheckCircle className="text-xs" />
                                  Collect Blood
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-white/10">
                {approvedDonations.map((donation, i) => (
                  <div
                    key={donation.id}
                    className="p-4 space-y-3"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-gray-400 text-xs" />
                          <span className="font-medium text-sm">{donation.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-gray-400 text-xs" />
                          <span className="text-gray-300 text-sm">{donation.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400 text-xs" />
                          <span className="text-gray-300 text-sm">{donation.location}</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getBloodTypeColor(donation.blood_type)}`}>
                        <FaTint className="text-xs" />
                        {donation.blood_type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <FaCalendarAlt />
                        <span>Approved {formatDate(donation.created_at)}</span>
                      </div>
                      <button
                        onClick={() => handleCollectDonation(donation)}
                        disabled={convertingId === donation.id}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-xs font-medium transition flex items-center gap-2"
                      >
                        {convertingId === donation.id ? (
                          <>
                            <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"></div>
                            Converting...
                          </>
                        ) : (
                          <>
                            <FaCheckCircle className="text-xs" />
                            Collect
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
