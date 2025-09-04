import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HospitalSidebar from '../components/HospitalSidebar';
import { 
  FaTint, 
  FaExclamationTriangle, 
  FaClock, 
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaSpinner,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaFilter,
  FaDownload,
  FaRefresh,
  FaBoxOpen,
  FaStethoscope
} from 'react-icons/fa';
import API_BASE_URL from '../../config/api.js';

export default function BloodInventory() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [summary, setSummary] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    bloodType: 'all',
    status: 'all',
    search: '',
    expiringWithin: 'all'
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const statusOptions = ['Available', 'Used', 'Expired'];

  // Fetch inventory data
  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Starting to fetch inventory...');

      const params = new URLSearchParams();
      if (filters.bloodType !== 'all') params.append('bloodType', filters.bloodType);
      if (filters.status !== 'all') params.append('status', filters.status);

      const url = `${API_BASE_URL}/api/hospital/inventory?${params}`;
      console.log('📡 Fetching from URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      if (response.status === 401) {
        console.log('❌ Unauthorized - redirecting to login');
        setError('You need to log in to view blood inventory');
        navigate('/hospital/login');
        return;
      }

      if (!response.ok) {
        console.log('❌ Response not OK:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Received data:', data);
      console.log('📊 Data type:', typeof data, 'Is array:', Array.isArray(data));
      console.log('📊 Data length:', data.length);
      
      setInventory(Array.isArray(data) ? data : []);
      console.log('✅ Inventory state updated with', Array.isArray(data) ? data.length : 0, 'items');
    } catch (err) {
      console.error('💥 Error fetching inventory:', err);
      setError(`Failed to load blood inventory: ${err.message}`);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary data
  const fetchSummary = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hospital/inventory/summary`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  // Fetch alerts data
  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hospital/inventory/alerts`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAlerts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchInventory();
      fetchSummary();
      fetchAlerts();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchInventory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.bloodType, filters.status, filters.expiringWithin]);

  useEffect(() => {
    fetchSummary();
    fetchAlerts();
  }, []);

  // Update blood unit status
  const updateUnitStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hospital/inventory/unit/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status,
          usedDate: status === 'Used' ? new Date().toISOString() : null
        }),
      });

      if (response.ok) {
        // Refresh inventory data
        fetchInventory();
        fetchSummary();
      } else {
        throw new Error('Failed to update unit status');
      }
    } catch (err) {
      console.error('Error updating unit status:', err);
      alert('Failed to update unit status. Please try again.');
    }
  };

  // View unit details
  const viewUnitDetails = (unit) => {
    setSelectedUnit(unit);
    setShowDetails(true);
  };

  // Handle bulk actions
  const handleBulkAction = async (action, selectedIds) => {
    try {
      const promises = selectedIds.map(id => {
        switch (action) {
          case 'mark-expired':
            return updateUnitStatus(id, 'Expired');
          case 'mark-used':
            return updateUnitStatus(id, 'Used');
          default:
            return Promise.resolve();
        }
      });
      
      await Promise.all(promises);
      alert(`${action} applied to ${selectedIds.length} units`);
    } catch (err) {
      console.error('Error applying bulk action:', err);
      alert('Failed to apply bulk action');
    }
  };

  // Export inventory data
  const exportInventory = () => {
    const csvContent = [
      ['ID', 'Blood Type', 'Donor Name', 'Donor Email', 'Status', 'Expiry Date', 'Created Date'],
      ...filteredInventory.map(unit => [
        unit.id,
        unit.blood_type,
        unit.donor_name,
        unit.donor_email,
        unit.status,
        formatDate(unit.expiry_date),
        formatDate(unit.created_at)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blood_inventory_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  // Filter inventory based on search and additional filters
  const filteredInventory = inventory.filter(unit => {
    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matchesSearch = (
        unit.donor_name?.toLowerCase().includes(search) ||
        unit.donor_email?.toLowerCase().includes(search) ||
        unit.blood_type?.toLowerCase().includes(search)
      );
      if (!matchesSearch) return false;
    }

    // Expiring filter
    if (filters.expiringWithin !== 'all') {
      const daysToExpiry = (new Date(unit.expiry_date) - new Date()) / (1000 * 60 * 60 * 24);
      const expiringDays = parseInt(filters.expiringWithin);
      if (daysToExpiry > expiringDays || daysToExpiry < 0) return false;
    }

    return true;
  });

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysDiff = (expiry - today) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7 && daysDiff >= 0;
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
      'O+': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'O-': 'bg-orange-600/20 text-orange-400 border-orange-600/30',
    };
    return colors[bloodType] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <HospitalSidebar />
      
      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Blood Inventory Management</h1>
          <p className="text-gray-300">
            Manage blood supply, track expiry dates, and monitor stock levels
          </p>
          {/* Debug Info */}
          <div className="text-xs bg-gray-800 p-3 rounded border">
            <div>🔍 Debug: Loading = {loading ? 'Yes' : 'No'}</div>
            <div>📊 Raw Inventory Count = {inventory.length}</div>
            <div>🔎 Filtered Count = {filteredInventory.length}</div>
            <div>⚙️ API URL = {API_BASE_URL}/api/hospital/inventory</div>
            {error && <div className="text-red-400">❌ Error: {error}</div>}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="backdrop-blur-md bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaExclamationTriangle className="text-red-400" />
              <h3 className="font-semibold text-red-300">Authentication Required</h3>
            </div>
            <p className="text-sm text-gray-300">{error}</p>
            <button 
              onClick={() => navigate('/hospital/login')}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition"
            >
              Go to Hospital Login
            </button>
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
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getBloodTypeColor(bloodType)}`}>
                    <FaTint className="text-xs" />
                    {bloodType}
                  </span>
                  {summaryData.expiring_soon > 0 && (
                    <FaClock className="text-amber-400 text-xs" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-white">
                    {summaryData.available_units}
                  </div>
                  <div className="text-xs text-gray-400">
                    {summaryData.total_units} total
                  </div>
                  {summaryData.expiring_soon > 0 && (
                    <div className="text-xs text-amber-400">
                      {summaryData.expiring_soon} expiring
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="backdrop-blur-md bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FaExclamationTriangle className="text-amber-400" />
              <h3 className="text-lg font-semibold text-amber-300">Inventory Alerts</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alerts.map((alert, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-3 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FaClock className="text-amber-400 text-sm" />
                    <span className="text-sm font-medium">{alert.type}</span>
                  </div>
                  <p className="text-xs text-gray-300">{alert.message}</p>
                  {alert.blood_type && (
                    <span className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded text-xs font-medium border ${getBloodTypeColor(alert.blood_type)}`}>
                      <FaTint className="text-xs" />
                      {alert.blood_type}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by donor name, email, or blood type..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full px-4 py-2 pl-10 rounded-lg bg-gray-900/50 border border-gray-700 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaTint className="text-sm" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  fetchInventory();
                  fetchSummary();
                  fetchAlerts();
                }}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <FaRefresh className="text-xs" />
                Refresh
              </button>
              <button
                onClick={exportInventory}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <FaDownload className="text-xs" />
                Export
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="mt-4 space-y-3">
            {/* Blood Type Filter */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Blood Type:</label>
              <div className="flex flex-wrap gap-2">
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
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Status:</label>
              <div className="flex flex-wrap gap-2">
                {['all', ...statusOptions].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilters(prev => ({ ...prev, status }))}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                      filters.status === status
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/60'
                    }`}
                  >
                    {status === 'all' ? 'All Status' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Expiry Filter */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Expiring Within:</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: '7', label: '7 Days' },
                  { value: '14', label: '14 Days' },
                  { value: '30', label: '30 Days' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFilters(prev => ({ ...prev, expiringWithin: option.value }))}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                      filters.expiringWithin === option.value
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/60'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2 border-l border-gray-600 pl-4">
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
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
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
              <FaSpinner className="animate-spin w-8 h-8 text-red-500 mx-auto mb-4" />
              <p className="text-gray-400">Loading blood inventory...</p>
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <FaTint className="mx-auto mb-4 text-4xl opacity-50" />
              <p>No blood units found matching your criteria.</p>
              {inventory.length === 0 && (
                <p className="text-sm mt-2">Try refreshing the page or contact support if this persists.</p>
              )}
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
                  {filteredInventory.map((unit) => (
                    <tr
                      key={unit.id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{unit.donor_name || 'Unknown'}</div>
                          <div className="text-gray-400 text-xs">{unit.donor_email || 'No email'}</div>
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
                          {unit.status === 'Available' ? (
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
                          ) : (
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

        {/* Stats Footer */}
        <div className="text-center text-sm text-gray-400">
          Showing {filteredInventory.length} of {inventory.length} blood units
        </div>
      </main>
    </div>
  );
}
