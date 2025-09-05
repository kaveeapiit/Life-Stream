import { useEffect, useState, useCallback } from 'react';
import HospitalSidebar from '../components/HospitalSidebar';
import AuthDebug from '../components/AuthDebug';
import { FaSearch, FaUser, FaEnvelope, FaTint, FaCalendarAlt } from 'react-icons/fa';
import hospitalAPI from '../../config/hospitalAPI.js';

export default function AvailableDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const fetchDonors = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(bloodTypeFilter !== 'all' && { bloodType: bloodTypeFilter })
      };

      console.log('Fetching donors with params:', params);
      const data = await hospitalAPI.getAvailableDonors(params);

      if (data) {
        console.log('Donors data received:', data);
        setDonors(data.donors);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (err) {
      console.error('Error fetching donors:', err);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  }, [search, bloodTypeFilter]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDonors(currentPage);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [search, bloodTypeFilter, currentPage, fetchDonors]);

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

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <HospitalSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-8 md:p-12 overflow-hidden">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Available Donors</h1>
          <p className="text-gray-300">
            View registered users who could potentially donate blood for planning purposes.
            Total: {total} registered donors
          </p>
          <AuthDebug />
        </div>

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

        {/* Results */}
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
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-4 py-3 font-semibold">Blood Type</th>
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
                          <div className="flex items-center gap-2">
                            <FaUser className="text-gray-400 text-xs" />
                            <span className="font-medium">{donor.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-gray-400 text-xs" />
                            <span className="text-gray-300">{donor.email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getBloodTypeColor(donor.blood_group)}`}>
                            <FaTint className="text-xs" />
                            {donor.blood_group}
                          </span>
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

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-white/10">
                {donors.map((donor, i) => (
                  <div
                    key={donor.id}
                    className="p-4 space-y-3"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-gray-400 text-xs" />
                          <span className="font-medium text-sm">{donor.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-gray-400 text-xs" />
                          <span className="text-gray-300 text-sm">{donor.email}</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getBloodTypeColor(donor.blood_group)}`}>
                        <FaTint className="text-xs" />
                        {donor.blood_group}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <FaCalendarAlt />
                      <span>Registered {formatDate(donor.created_at)}</span>
                    </div>
                  </div>
                ))}
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
      </main>
    </div>
  );
}
