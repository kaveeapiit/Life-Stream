import { useEffect, useState, useCallback } from 'react';
import HospitalSidebar from '../components/HospitalSidebar';
import { 
  FaSearch, 
  FaUser, 
  FaEnvelope, 
  FaTint, 
  FaCalendarAlt, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaFilter,
  FaHeart,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle
} from 'react-icons/fa';
import API_BASE_URL from '../../config/api.js';

export default function DonorRequestMatching() {
  const [donors, setDonors] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [compatibleDonors, setCompatibleDonors] = useState([]);
  const [matchingSummary, setMatchingSummary] = useState([]);
  const [showMatchingPanel, setShowMatchingPanel] = useState(false);
  const [bloodTypeOverview, setBloodTypeOverview] = useState([]);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Fetch donors with request matching context
  const fetchDonors = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15',
        ...(search && { search }),
        ...(bloodTypeFilter !== 'all' && { bloodType: bloodTypeFilter })
      });

      const res = await fetch(`${API_BASE_URL}/api/hospital/donors/matching?${params}`, {
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch donors: ${res.status}`);
      }
      
      const data = await res.json();
      setDonors(data.donors);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      console.error('Error fetching donors:', err);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  }, [search, bloodTypeFilter]);

  // Fetch pending blood requests
  const fetchBloodRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/hospital/blood-requests?status=pending&limit=50`, {
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setBloodRequests(data.requests);
      }
    } catch (err) {
      console.error('Error fetching blood requests:', err);
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  // Fetch donor-request matching summary
  const fetchMatchingSummary = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hospital/matching/summary`, {
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setMatchingSummary(data);
      }
    } catch (err) {
      console.error('Error fetching matching summary:', err);
    }
  }, []);

  // Fetch blood type overview
  const fetchBloodTypeOverview = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hospital/matching/overview`, {
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setBloodTypeOverview(data);
      }
    } catch (err) {
      console.error('Error fetching blood type overview:', err);
    }
  }, []);

  // Find compatible donors for a specific request
  const findCompatibleDonors = async (requestId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hospital/blood-requests/${requestId}/compatible-donors?limit=30`, {
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setCompatibleDonors(data.donors);
        setSelectedRequest(data.request);
        setShowMatchingPanel(true);
      }
    } catch (err) {
      console.error('Error finding compatible donors:', err);
      alert('Failed to find compatible donors');
    }
  };

  useEffect(() => {
    fetchDonors(currentPage);
  }, [fetchDonors, currentPage]);

  useEffect(() => {
    fetchBloodRequests();
    fetchMatchingSummary();
    fetchBloodTypeOverview();
  }, [fetchBloodRequests, fetchMatchingSummary, fetchBloodTypeOverview]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleBloodTypeFilter = (type) => {
    setBloodTypeFilter(type);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  const getCompatibilityBadge = (donorType) => {
    if (donorType === 'Universal Donor') {
      return 'bg-gold-500/20 text-yellow-300 border-yellow-500/30';
    } else if (donorType === 'Universal Recipient') {
      return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <HospitalSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-8 md:p-12 overflow-hidden">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Donor-Request Matching</h1>
          <p className="text-gray-300">
            Match available donors with blood requests to optimize compatibility and response time.
            Total: {total} registered donors
          </p>
        </div>

        {/* Blood Type Overview */}
        <section className="mb-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Blood Type Overview</h3>
            <FaInfoCircle className="text-gray-400" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {bloodTypeOverview.map((overview) => (
              <div key={overview.bloodType} className="text-center">
                <div className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border ${getBloodTypeColor(overview.bloodType)} mb-2`}>
                  <FaTint className="text-xs" />
                  {overview.bloodType}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-green-400">
                    <FaUsers className="inline mr-1" />
                    {overview.availableDonors} donors
                  </div>
                  <div className="text-red-400">
                    <FaHeart className="inline mr-1" />
                    {overview.pendingRequests} requests
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pending Requests Panel */}
        <section className="mb-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pending Blood Requests ({bloodRequests.length})</h3>
            <button
              onClick={() => setShowMatchingPanel(!showMatchingPanel)}
              className="flex items-center gap-2 px-3 py-1 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 transition"
            >
              {showMatchingPanel ? <FaChevronUp /> : <FaChevronDown />}
              {showMatchingPanel ? 'Hide' : 'Show'} Matching Panel
            </button>
          </div>
          
          {(showMatchingPanel || bloodRequests.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bloodRequests.slice(0, 6).map((request) => (
                <div key={request.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{request.name}</h4>
                      <p className="text-sm text-gray-400">{request.email}</p>
                    </div>
                    {request.urgency && (
                      <FaExclamationTriangle className="text-red-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getBloodTypeColor(request.blood_type)}`}>
                      <FaTint className="text-xs" />
                      {request.blood_type}
                    </span>
                    <button
                      onClick={() => findCompatibleDonors(request.id)}
                      className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded text-xs hover:bg-blue-600/30 transition"
                    >
                      Find Donors
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 transition"
            />
          </div>

          {/* Blood Type Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleBloodTypeFilter('all')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                bloodTypeFilter === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/60'
              }`}
            >
              All Types
            </button>
            {bloodTypes.map(type => (
              <button
                key={type}
                onClick={() => handleBloodTypeFilter(type)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                  bloodTypeFilter === type
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/60'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Donors Results */}
        <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading donors...</p>
            </div>
          ) : donors.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <FaUser className="mx-auto mb-4 text-4xl opacity-50" />
              <p>No donors found matching your criteria.</p>
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
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Matching Requests</th>
                      <th className="px-4 py-3 font-semibold">Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.map((donor, i) => (
                      <tr
                        key={donor.id}
                        className="border-t border-white/5 hover:bg-white/5 transition-all duration-200"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FaUser className="text-gray-400 text-xs" />
                              <span className="font-medium">{donor.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaEnvelope className="text-gray-400 text-xs" />
                              <span className="text-gray-300 text-xs">{donor.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getBloodTypeColor(donor.blood_type)}`}>
                            <FaTint className="text-xs" />
                            {donor.blood_type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getCompatibilityBadge(donor.donor_category)}`}>
                            {donor.donor_category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {donor.matching_requests > 0 ? (
                              <span className="flex items-center gap-1 text-red-400">
                                <FaHeart className="text-xs" />
                                <span className="font-medium">{donor.matching_requests}</span>
                                <span className="text-xs">requests</span>
                              </span>
                            ) : (
                              <span className="text-gray-500 text-xs">No matches</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-gray-400">
                            <FaCalendarAlt className="text-xs" />
                            <span className="text-sm">{formatDate(donor.created_at)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-white/10 flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded bg-gray-700/60 text-gray-300 hover:bg-gray-600/60 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded bg-gray-700/60 text-gray-300 hover:bg-gray-600/60 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* Compatible Donors Modal */}
        {showMatchingPanel && selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">
                  Compatible Donors for {selectedRequest.name} ({selectedRequest.blood_type})
                </h3>
                <button
                  onClick={() => setShowMatchingPanel(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded font-medium border ${getBloodTypeColor(selectedRequest.blood_type)}`}>
                    <FaTint />
                    {selectedRequest.blood_type}
                  </span>
                  {selectedRequest.urgency && (
                    <span className="flex items-center gap-1 text-red-400">
                      <FaExclamationTriangle />
                      Urgent Request
                    </span>
                  )}
                  <span className="text-gray-300">
                    {compatibleDonors.length} compatible donors found
                  </span>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {compatibleDonors.map((donor) => (
                  <div key={donor.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{donor.name}</p>
                        <p className="text-sm text-gray-400">{donor.email}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getBloodTypeColor(donor.blood_type)}`}>
                        <FaTint className="text-xs" />
                        {donor.blood_type}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                        donor.compatibility_type === 'Exact Match' 
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : donor.compatibility_type === 'Universal Donor'
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }`}>
                        {donor.compatibility_type}
                      </span>
                    </div>
                    <button className="px-3 py-1 bg-green-600/20 text-green-300 rounded text-xs hover:bg-green-600/30 transition">
                      Contact Donor
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
