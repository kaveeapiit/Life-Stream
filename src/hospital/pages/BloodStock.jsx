import { useEffect, useState } from 'react';
import HospitalSidebar from '../components/HospitalSidebar';
import { 
  FaTint, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaExclamationTriangle, 
  FaCheckCircle,
  FaSpinner,
  FaPlus,
  FaMinus
} from 'react-icons/fa';
import hospitalAPI from '../../config/hospitalAPI.js';

export default function BloodStock() {
  const [bloodStock, setBloodStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Fetch blood stock data
  const fetchBloodStock = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await hospitalAPI.request('/api/hospital/blood-stock', {
        method: 'GET',
      });

      if (!response) {
        setError('You need to log in to view blood stock');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBloodStock(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Failed to load blood stock: ${err.message}`);
      setBloodStock([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary and alerts
  const fetchSummaryAndAlerts = async () => {
    try {
      const [summaryResponse, alertsResponse] = await Promise.all([
        hospitalAPI.request('/api/hospital/blood-stock/summary', {
          method: 'GET',
        }),
        hospitalAPI.request('/api/hospital/blood-stock/alerts', {
          method: 'GET',
        })
      ]);

      if (summaryResponse && summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        setSummary(summaryData);
      }

      if (alertsResponse && alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        setAlerts(alertsData);
      }
    } catch (err) {
      console.error('Error fetching summary/alerts:', err);
    }
  };

  useEffect(() => {
    fetchBloodStock();
    fetchSummaryAndAlerts();
  }, []);

  // Start editing a blood type
  const startEditing = (bloodType, currentStock) => {
    setEditingType(bloodType);
    setEditValues({ [bloodType]: currentStock });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingType(null);
    setEditValues({});
  };

  // Update stock count
  const updateStock = async (bloodType, newStock) => {
    try {
      setSaving(true);
      setError(null);

      const response = await hospitalAPI.request(`/api/hospital/blood-stock/${bloodType}`, {
        method: 'PUT',
        body: JSON.stringify({ stockCount: parseInt(newStock) }),
      });

      if (!response || !response.ok) {
        throw new Error(`HTTP error! status: ${response?.status || 'Unknown'}`);
      }

      // Refresh data
      await fetchBloodStock();
      await fetchSummaryAndAlerts();
      
      setEditingType(null);
      setEditValues({});
    } catch (err) {
      setError(`Failed to update stock: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Handle input change
  const handleInputChange = (bloodType, value) => {
    const numValue = Math.max(0, Math.min(9999, parseInt(value) || 0));
    setEditValues({ ...editValues, [bloodType]: numValue });
  };

  // Quick increment/decrement
  const adjustStock = (bloodType, currentStock, delta) => {
    const newStock = Math.max(0, Math.min(9999, currentStock + delta));
    updateStock(bloodType, newStock);
  };

  // Get stock level color
  const getStockLevelColor = (count) => {
    if (count === 0) return 'text-red-500';
    if (count < 10) return 'text-orange-500';
    if (count < 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  // Get stock level status
  const getStockStatus = (count) => {
    if (count === 0) return { text: 'Out of Stock', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    if (count < 10) return { text: 'Low Stock', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    if (count < 30) return { text: 'Medium Stock', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    return { text: 'Good Stock', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
  };

  // Get blood type color
  const getBloodTypeColor = (bloodType) => {
    const colors = {
      'A+': 'bg-red-600/20 text-red-400 border-red-600/30',
      'A-': 'bg-red-500/20 text-red-300 border-red-500/30',
      'B+': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
      'B-': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'AB+': 'bg-purple-600/20 text-purple-400 border-purple-600/30',
      'AB-': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'O+': 'bg-green-600/20 text-green-400 border-green-600/30',
      'O-': 'bg-green-500/20 text-green-300 border-green-500/30'
    };
    return colors[bloodType] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <HospitalSidebar />
        <main className="flex-1 ml-0 md:ml-64 p-8 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <FaSpinner className="animate-spin text-red-500" />
            <span>Loading blood stock...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <HospitalSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-8 md:p-12 overflow-hidden">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Blood Stock Management</h1>
          <p className="text-gray-300">
            Manage blood stock levels for all blood types. Click edit to manually update stock counts.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 backdrop-blur-md bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-400">
              <FaExclamationTriangle />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="backdrop-blur-md bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaTint className="text-blue-400" />
                <span className="text-sm text-gray-300">Total Units</span>
              </div>
              <div className="text-3xl font-bold text-blue-400">{summary.total_units || 0}</div>
            </div>

            <div className="backdrop-blur-md bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaCheckCircle className="text-green-400" />
                <span className="text-sm text-gray-300">Adequate Stock</span>
              </div>
              <div className="text-3xl font-bold text-green-400">{summary.adequate_stock_types || 0}</div>
            </div>

            <div className="backdrop-blur-md bg-orange-500/10 border border-orange-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaExclamationTriangle className="text-orange-400" />
                <span className="text-sm text-gray-300">Low Stock</span>
              </div>
              <div className="text-3xl font-bold text-orange-400">{summary.low_stock_types || 0}</div>
            </div>

            <div className="backdrop-blur-md bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaTimes className="text-red-400" />
                <span className="text-sm text-gray-300">Out of Stock</span>
              </div>
              <div className="text-3xl font-bold text-red-400">{summary.out_of_stock_types || 0}</div>
            </div>
          </div>
        )}

        {/* Low Stock Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8 backdrop-blur-md bg-orange-500/10 border border-orange-500/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaExclamationTriangle className="text-orange-400" />
              <h3 className="text-lg font-semibold text-orange-400">Low Stock Alerts</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {alerts.map((alert) => (
                <div key={alert.blood_type} className="flex items-center gap-2 text-sm">
                  <span className={`px-2 py-1 rounded border text-xs font-medium ${getBloodTypeColor(alert.blood_type)}`}>
                    {alert.blood_type}
                  </span>
                  <span className="text-orange-400">
                    {alert.stock_count} unit{alert.stock_count !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blood Stock Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bloodTypes.map((bloodType) => {
            const stockData = bloodStock.find(stock => stock.blood_type === bloodType);
            const stockCount = stockData?.stock_count || 0;
            const isEditing = editingType === bloodType;
            const editValue = editValues[bloodType] || stockCount;
            const status = getStockStatus(stockCount);

            return (
              <div
                key={bloodType}
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                {/* Blood Type Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`px-3 py-1 rounded-lg border text-sm font-bold ${getBloodTypeColor(bloodType)}`}>
                    {bloodType}
                  </div>
                  <div className={`px-2 py-1 rounded border text-xs ${status.color}`}>
                    {status.text}
                  </div>
                </div>

                {/* Stock Count */}
                <div className="mb-4">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="9999"
                        value={editValue}
                        onChange={(e) => handleInputChange(bloodType, e.target.value)}
                        className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                        autoFocus
                      />
                      <span className="text-sm text-gray-400">units</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-3xl font-bold ${getStockLevelColor(stockCount)}`}>
                          {stockCount}
                        </div>
                        <div className="text-sm text-gray-400">units available</div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => adjustStock(bloodType, stockCount, 1)}
                          className="p-1 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition"
                          disabled={saving}
                        >
                          <FaPlus className="text-xs" />
                        </button>
                        <button
                          onClick={() => adjustStock(bloodType, stockCount, -1)}
                          className="p-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition"
                          disabled={saving || stockCount === 0}
                        >
                          <FaMinus className="text-xs" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => updateStock(bloodType, editValue)}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg transition text-sm font-medium disabled:opacity-50"
                      >
                        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={saving}
                        className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition text-sm disabled:opacity-50"
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEditing(bloodType, stockCount)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition text-sm font-medium"
                    >
                      <FaEdit />
                      Edit Stock
                    </button>
                  )}
                </div>

                {/* Last Updated */}
                {stockData?.last_updated && (
                  <div className="mt-3 text-xs text-gray-500">
                    Last updated: {new Date(stockData.last_updated).toLocaleDateString()}
                    {stockData.updated_by && ` by ${stockData.updated_by}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}