import { useEffect, useState, useCallback } from 'react';
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
  FaDownload,
  FaRefresh,
  FaEye,
  FaEdit
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
  const statusOptions = ['Available', 'Used', 'Expired', 'Reserved'];

  // Fetch inventory data
  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.bloodType !== 'all') params.append('bloodType', filters.bloodType);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.expiringWithin !== 'all') params.append('expiringWithinDays', filters.expiringWithin);

      const url = `${API_BASE_URL}/api/hospital/inventory?${params}`;
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        setError('You need to log in to view blood inventory');
        navigate('/hospital/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(`Failed to load blood inventory: ${err.message}`);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }, [filters.bloodType, filters.status, filters.expiringWithin, navigate]);

  // Fetch summary data
  const fetchSummary = useCallback(async () => {
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
  }, []);

  // Fetch alerts data
  const fetchAlerts = useCallback(async () => {
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
  }, []);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchInventory();
      fetchSummary();
      fetchAlerts();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchInventory, fetchSummary, fetchAlerts]);

  // Load data on component mount
  useEffect(() => {
    fetchInventory();
    fetchSummary();
    fetchAlerts();
  }, [fetchInventory, fetchSummary, fetchAlerts]);

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
        fetchInventory();
        fetchSummary();
        fetchAlerts();
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
      case 'Reserved': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">Blood Inventory Management</h1>
              <p className="text-gray-300">
                Manage blood supply, track expiry dates, and monitor stock levels
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  fetchInventory();
                  fetchSummary();
                  fetchAlerts();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <FaRefresh className="text-xs" />
                Refresh
              </button>
              <button
                onClick={exportInventory}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <FaDownload className="text-xs" />
                Export CSV
              </button>
            </div>
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

        {/* Filters */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
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
            </div>

            {/* Filter Pills */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
              <p className="text-lg font-semibold mb-2">No Blood Units Found</p>
              <p className="text-sm">
                {inventory.length === 0 
                  ? "No blood units in inventory. Start by collecting donations."
                  : "No units match your current filters. Try adjusting your search criteria."
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Unit ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Blood Type</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Donor</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Expiry Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Collected</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {filteredInventory.map((unit) => (
                    <tr 
                      key={unit.id} 
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-mono text-gray-300">
                        #{unit.id}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getBloodTypeColor(unit.blood_type)}`}>
                          <FaTint className="text-xs" />
                          {unit.blood_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-white">{unit.donor_name}</div>
                          <div className="text-xs text-gray-400">{unit.donor_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(unit.status)}`}>
                          {unit.status === 'Available' && <FaCheckCircle />}
                          {unit.status === 'Used' && <FaTimesCircle />}
                          {unit.status === 'Expired' && <FaClock />}
                          {unit.status === 'Reserved' && <FaHourglassHalf />}
                          {unit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{formatDate(unit.expiry_date)}</div>
                        {isExpiringSoon(unit.expiry_date) && (
                          <div className="flex items-center gap-1 text-xs text-amber-400 mt-1">
                            <FaExclamationTriangle />
                            Expiring Soon
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {formatDate(unit.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewUnitDetails(unit)}
                            className="p-1 text-blue-400 hover:text-blue-300 transition"
                            title="View Details"
                          >
                            <FaEye className="text-sm" />
                          </button>
                          {unit.status === 'Available' && (
                            <>
                              <button
                                onClick={() => updateUnitStatus(unit.id, 'Used')}
                                className="p-1 text-green-400 hover:text-green-300 transition"
                                title="Mark as Used"
                              >
                                <FaCheckCircle className="text-sm" />
                              </button>
                              <button
                                onClick={() => updateUnitStatus(unit.id, 'Expired')}
                                className="p-1 text-red-400 hover:text-red-300 transition"
                                title="Mark as Expired"
                              >
                                <FaTimesCircle className="text-sm" />
                              </button>
                            </>
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

        {/* Statistics */}
        <div className="text-center text-sm text-gray-400">
          Showing {filteredInventory.length} of {inventory.length} blood units
        </div>

        {/* Unit Details Modal */}
        {showDetails && selectedUnit && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-lg w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Blood Unit Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <FaTimesCircle />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400">Unit ID</label>
                    <div className="font-mono text-sm">#{selectedUnit.id}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Blood Type</label>
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getBloodTypeColor(selectedUnit.blood_type)}`}>
                        <FaTint className="text-xs" />
                        {selectedUnit.blood_type}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Donor Information</label>
                  <div className="text-sm">
                    <div className="font-medium">{selectedUnit.donor_name}</div>
                    <div className="text-gray-400">{selectedUnit.donor_email}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400">Status</label>
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(selectedUnit.status)}`}>
                        {selectedUnit.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Expiry Date</label>
                    <div className="text-sm">{formatDate(selectedUnit.expiry_date)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400">Collected Date</label>
                    <div className="text-sm">{formatDate(selectedUnit.created_at)}</div>
                  </div>
                  {selectedUnit.used_date && (
                    <div>
                      <label className="text-xs text-gray-400">Used Date</label>
                      <div className="text-sm">{formatDate(selectedUnit.used_date)}</div>
                    </div>
                  )}
                </div>
                
                {selectedUnit.donation_id && (
                  <div>
                    <label className="text-xs text-gray-400">Related Donation ID</label>
                    <div className="text-sm font-mono">#{selectedUnit.donation_id}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
