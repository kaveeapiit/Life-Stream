import { useEffect, useState, useCallback } from 'react';
import HospitalSidebar from '../components/HospitalSidebar';
import { 
  FaTint, 
  FaExclamationTriangle, 
  FaClock, 
  FaChartBar,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf
} from 'react-icons/fa';
import API_BASE_URL from '../../config/api.js';

export default function BloodInventory() {
  const [inventory, setInventory] = useState([]);
  const [summary, setSummary] = useState([]);
  const [alerts, setAlerts] = useState({ lowStock: [], expiringUnits: [] });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    bloodType: 'all',
    status: 'all',
    search: '',
    expiringWithinDays: ''
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const statusOptions = ['Available', 'Used', 'Expired'];

  // Fetch inventory data
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.bloodType !== 'all') params.append('bloodType', filters.bloodType);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.expiringWithinDays) params.append('expiringWithinDays', filters.expiringWithinDays);

      const res = await fetch(`${API_BASE_URL}/api/hospital/inventory?${params}`, {
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to fetch inventory');
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch summary data
  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hospital/inventory/summary`, {
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to fetch summary');
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error('Error fetching summary:', err);
      setSummary([]);
    }
  }, []);

  // Fetch alerts
  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hospital/inventory/alerts`, {
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to fetch alerts');
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setAlerts({ lowStock: [], expiringUnits: [] });
    }
  }, []);

  useEffect(() => {
    fetchInventory();
    fetchSummary();
    fetchAlerts();
  }, [fetchInventory, fetchSummary, fetchAlerts]);

  // Update blood unit status
  const updateUnitStatus = async (id, status) => {
    try {
      const body = { status };
      if (status === 'Used') {
        body.usedDate = new Date().toISOString();
      }

      const res = await fetch(`${API_BASE_URL}/api/hospital/inventory/unit/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error('Failed to update unit status');
      
      // Refresh data
      fetchInventory();
      fetchSummary();
      fetchAlerts();
    } catch (err) {
      console.error('Error updating unit status:', err);
      alert('Failed to update unit status');
    }
  };

  // Mark expired units
  const markExpiredUnits = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hospital/inventory/mark-expired`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to mark expired units');
      
      const data = await res.json();
      alert(data.message);
      
      // Refresh data
      fetchInventory();
      fetchSummary();
      fetchAlerts();
    } catch (err) {
      console.error('Error marking expired units:', err);
      alert('Failed to mark expired units');
    }
  };

  // Filtered inventory based on search
  const filteredInventory = inventory.filter(unit => {
    if (!filters.search) return true;
    const search = filters.search.toLowerCase();
    return (
      unit.donor_name.toLowerCase().includes(search) ||
      unit.donor_email.toLowerCase().includes(search) ||
      unit.blood_type.toLowerCase().includes(search)
    );
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Used': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Expired': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
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

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <HospitalSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-8 md:p-12 overflow-hidden">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Blood Inventory Management</h1>
          <p className="text-gray-300">
            Manage blood supply, track expiry dates, and monitor stock levels
          </p>
        </div>

        {/* Alerts Section */}
        {(alerts.lowStock.length > 0 || alerts.expiringUnits.length > 0) && (
          <div className="mb-8 space-y-4">
            {alerts.lowStock.length > 0 && (
              <div className="backdrop-blur-md bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaExclamationTriangle className="text-red-400" />
                  <h3 className="font-semibold text-red-300">Low Stock Alert</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Low stock for: {alerts.lowStock.map(item => `${item.blood_type} (${item.available_units} units)`).join(', ')}
                </p>
              </div>
            )}

            {alerts.expiringUnits.length > 0 && (
              <div className="backdrop-blur-md bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaClock className="text-amber-400" />
                  <h3 className="font-semibold text-amber-300">Expiring Soon</h3>
                </div>
                <p className="text-sm text-gray-300">
                  {alerts.expiringUnits.length} units expiring within 7 days
                </p>
                <button
                  onClick={markExpiredUnits}
                  className="mt-2 px-3 py-1 bg-amber-600 hover:bg-amber-700 rounded text-sm font-medium transition"
                >
                  Mark Expired Units
                </button>
              </div>
            )}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {bloodTypes.map(bloodType => {
            const summaryData = summary.find(s => s.blood_type === bloodType) || {
              available_units: 0,
              total_units: 0,
              expiring_soon: 0
            };

            return (
              <div
                key={bloodType}
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 text-center"
              >
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-2 ${getBloodTypeColor(bloodType)}`}>
                  <FaTint className="text-sm" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{bloodType}</h3>
                <p className="text-lg font-bold">{summaryData.available_units}</p>
                <p className="text-xs text-gray-400">available</p>
                {summaryData.expiring_soon > 0 && (
                  <p className="text-xs text-amber-400 mt-1">
                    {summaryData.expiring_soon} expiring
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search by donor name, email..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 transition"
              />
            </div>

            {/* Expiring filter */}
            <select
              value={filters.expiringWithinDays}
              onChange={(e) => setFilters(prev => ({ ...prev, expiringWithinDays: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/60"
            >
              <option value="">All dates</option>
              <option value="7">Expiring in 7 days</option>
              <option value="14">Expiring in 14 days</option>
              <option value="30">Expiring in 30 days</option>
            </select>
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2">
            {/* Blood type filter */}
            <button
              onClick={() => setFilters(prev => ({ ...prev, bloodType: 'all' }))}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                filters.bloodType === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/60'
              }`}
            >
              All Types
            </button>
            {bloodTypes.map(type => (
              <button
                key={type}
                onClick={() => setFilters(prev => ({ ...prev, bloodType: type }))}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  filters.bloodType === type
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/60'
                }`}
              >
                {type}
              </button>
            ))}

            {/* Status filter */}
            <div className="border-l border-gray-600 pl-2 ml-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  filters.status === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/60'
                }`}
              >
                All Status
              </button>
              {statusOptions.map(status => (
                <button
                  key={status}
                  onClick={() => setFilters(prev => ({ ...prev, status }))}
                  className={`ml-2 px-3 py-1 rounded-lg text-xs font-medium transition ${
                    filters.status === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/60'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading inventory...</p>
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <FaTint className="mx-auto mb-4 text-4xl opacity-50" />
              <p>No blood units found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/10 sticky top-0 z-10">
                  <tr className="text-left text-gray-200">
                    <th className="px-4 py-3 font-semibold">Donor</th>
                    <th className="px-4 py-3 font-semibold">Blood Type</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Expiry Date</th>
                    <th className="px-4 py-3 font-semibold">Created</th>
                    <th className="px-4 py-3 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((unit, i) => (
                    <tr
                      key={unit.id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{unit.donor_name}</div>
                          <div className="text-gray-400 text-xs">{unit.donor_email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getBloodTypeColor(unit.blood_type)}`}>
                          <FaTint className="text-xs" />
                          {unit.blood_type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(unit.status)}`}>
                          {unit.status === 'Available' && <FaCheckCircle className="text-xs" />}
                          {unit.status === 'Used' && <FaCheckCircle className="text-xs" />}
                          {unit.status === 'Expired' && <FaTimesCircle className="text-xs" />}
                          {unit.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-2 ${isExpiringSoon(unit.expiry_date) ? 'text-amber-400' : 'text-gray-300'}`}>
                          <FaCalendarAlt className="text-xs" />
                          <span className="text-sm">{formatDate(unit.expiry_date)}</span>
                          {isExpiringSoon(unit.expiry_date) && (
                            <FaHourglassHalf className="text-amber-400 text-xs" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-400">
                          <FaCalendarAlt className="text-xs" />
                          <span className="text-sm">{formatDate(unit.created_at)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          {unit.status === 'Available' && (
                            <>
                              <button
                                onClick={() => updateUnitStatus(unit.id, 'Used')}
                                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium transition"
                                title="Mark as Used"
                              >
                                Use
                              </button>
                              <button
                                onClick={() => updateUnitStatus(unit.id, 'Expired')}
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-medium transition"
                                title="Mark as Expired"
                              >
                                Expire
                              </button>
                            </>
                          )}
                          {unit.status !== 'Available' && (
                            <span className="text-xs text-gray-500">No actions</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
