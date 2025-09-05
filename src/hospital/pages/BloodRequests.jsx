import { useEffect, useState, useCallback } from 'react';
import HospitalSidebar from '../components/HospitalSidebar';
import { 
  FaSearch, 
  FaFilter, 
  FaUser, 
  FaEnvelope, 
  FaTint, 
  FaCalendarAlt, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaTimesCircle,
  FaEye,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import hospitalAPI from '../../config/hospitalAPI.js';

export default function BloodRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'fulfilled', label: 'Fulfilled' },
    { value: 'declined', label: 'Declined' }
  ];

  const fetchRequests = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page: page.toString(),
        limit: '15',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(bloodTypeFilter !== 'all' && { bloodType: bloodTypeFilter }),
        ...(urgencyFilter !== 'all' && { urgency: urgencyFilter })
      };

      const data = await hospitalAPI.getAllBloodRequests(params);

      if (data) {
        setRequests(data.requests);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (err) {
      console.error('Error fetching blood requests:', err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, bloodTypeFilter, urgencyFilter]);

  useEffect(() => {
    fetchRequests(currentPage);
  }, [fetchRequests, currentPage]);

  const handleStatusUpdate = async (requestId, newStatus, notes = '') => {
    setActionLoading(true);
    try {
      const result = await hospitalAPI.updateBloodRequestStatus(requestId, newStatus);

      if (result) {
        // Refresh the requests list
        await fetchRequests(currentPage);
        setShowDetails(false);
        setSelectedRequest(null);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update request status');
    } finally {
      setActionLoading(false);
    }
  };

  const viewRequestDetails = async (requestId) => {
    try {
      const request = await hospitalAPI.getBloodRequestDetails(requestId);

      if (request) {
        setSelectedRequest(request);
        setShowDetails(true);
      }
    } catch (err) {
      console.error('Error fetching request details:', err);
      alert('Failed to load request details');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-300 border-green-500/30',
      fulfilled: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      declined: 'bg-red-500/20 text-red-300 border-red-500/30',
      cancelled: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatHoursAgo = (hours) => {
    if (hours < 1) return 'Less than 1 hour ago';
    if (hours < 24) return `${Math.floor(hours)} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <HospitalSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-8 md:p-12 overflow-hidden">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Blood Request Management</h1>
          <p className="text-gray-300">
            Manage and track blood requests to ensure proper care and response. 
            Total: {total} requests
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Status and Blood Type Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/60"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Blood Type Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">Blood Type</label>
              <select
                value={bloodTypeFilter}
                onChange={(e) => {
                  setBloodTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/60"
              >
                <option value="all">All Types</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Urgency Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">Urgency</label>
              <select
                value={urgencyFilter}
                onChange={(e) => {
                  setUrgencyFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/60"
              >
                <option value="all">All Urgency</option>
                <option value="true">Urgent</option>
                <option value="false">Normal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading blood requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <FaTint className="mx-auto mb-4 text-4xl opacity-50" />
              <p>No blood requests found matching your criteria.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/10 sticky top-0 z-10">
                    <tr className="text-left text-gray-200">
                      <th className="px-4 py-3 font-semibold">Patient</th>
                      <th className="px-4 py-3 font-semibold">Blood Type</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Urgency</th>
                      <th className="px-4 py-3 font-semibold">Created</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request, i) => (
                      <tr
                        key={request.id}
                        className="border-t border-white/5 hover:bg-white/5 transition-all duration-200"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FaUser className="text-gray-400 text-xs" />
                              <span className="font-medium">{request.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaEnvelope className="text-gray-400 text-xs" />
                              <span className="text-gray-300 text-xs">{request.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getBloodTypeColor(request.blood_type)}`}>
                            <FaTint className="text-xs" />
                            {request.blood_type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {request.urgency ? (
                            <span className="flex items-center gap-1 text-red-400">
                              <FaExclamationTriangle className="text-xs" />
                              <span className="text-xs font-medium">Urgent</span>
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">Normal</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-400">
                              <FaCalendarAlt className="text-xs" />
                              <span className="text-xs">{formatDate(request.created_at)}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatHoursAgo(request.hours_ago)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => viewRequestDetails(request.id)}
                              className="p-1 rounded bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 transition"
                              title="View Details"
                            >
                              <FaEye className="text-xs" />
                            </button>
                            {request.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(request.id, 'approved')}
                                  disabled={actionLoading}
                                  className="p-1 rounded bg-green-600/20 text-green-300 hover:bg-green-600/30 transition disabled:opacity-50"
                                  title="Approve"
                                >
                                  <FaCheckCircle className="text-xs" />
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(request.id, 'declined')}
                                  disabled={actionLoading}
                                  className="p-1 rounded bg-red-600/20 text-red-300 hover:bg-red-600/30 transition disabled:opacity-50"
                                  title="Decline"
                                >
                                  <FaTimesCircle className="text-xs" />
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

        {/* Request Details Modal */}
        {showDetails && selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Blood Request Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Patient Name</label>
                    <p className="text-white">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Email</label>
                    <p className="text-white">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Blood Type</label>
                    <p className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium border ${getBloodTypeColor(selectedRequest.blood_type)}`}>
                      <FaTint className="text-xs" />
                      {selectedRequest.blood_type}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Status</label>
                    <p className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium border ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Urgency</label>
                    <p className={selectedRequest.urgency ? 'text-red-400' : 'text-gray-300'}>
                      {selectedRequest.urgency_level}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Location</label>
                    <p className="text-white">{selectedRequest.location || 'Not specified'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400">Created</label>
                  <p className="text-white">{formatDate(selectedRequest.created_at)}</p>
                  <p className="text-sm text-gray-400">{formatHoursAgo(selectedRequest.hours_ago)}</p>
                </div>

                {selectedRequest.hospital_notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Hospital Notes</label>
                    <p className="text-white bg-gray-700/50 p-3 rounded">{selectedRequest.hospital_notes}</p>
                  </div>
                )}

                {selectedRequest.assigned_hospital && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Assigned Hospital</label>
                    <p className="text-white">{selectedRequest.assigned_hospital}</p>
                  </div>
                )}

                {/* Quick Actions */}
                {selectedRequest.status === 'pending' && (
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="font-medium mb-3">Quick Actions</h4>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleStatusUpdate(selectedRequest.id, 'approved', 'Approved by hospital staff')}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                      >
                        Approve Request
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedRequest.id, 'declined', 'Declined by hospital staff')}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
                      >
                        Decline Request
                      </button>
                    </div>
                  </div>
                )}

                {selectedRequest.status === 'approved' && (
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="font-medium mb-3">Mark as Fulfilled</h4>
                    <button
                      onClick={() => handleStatusUpdate(selectedRequest.id, 'fulfilled', 'Blood request fulfilled successfully')}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      Mark as Fulfilled
                    </button>
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
