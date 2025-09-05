import { useEffect, useState, useCallback } from 'react';
import HospitalSidebar from '../components/HospitalSidebar';
import { 
  FaPlus, 
  FaFilter, 
  FaUser, 
  FaEnvelope, 
  FaTint, 
  FaCalendarAlt, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaTimesCircle,
  FaEye,
  FaHandHoldingHeart,
  FaHospital,
  FaClock,
  FaInfoCircle,
  FaHeartbeat,
  FaBuilding
} from 'react-icons/fa';
import hospitalAPI from '../../config/hospitalAPI.js';

export default function HospitalToHospitalRequests() {
  const [activeTab, setActiveTab] = useState('available'); // available, myRequests, createRequest
  const [availableRequests, setAvailableRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Filters for available requests
  const [bloodTypeFilter, setBloodTypeFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters for my requests
  const [statusFilter, setStatusFilter] = useState('all');
  const [myCurrentPage, setMyCurrentPage] = useState(1);
  const [myTotalPages, setMyTotalPages] = useState(1);
  const [myTotal, setMyTotal] = useState(0);

  // Selected request for details/response
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);

  // Create request form
  const [createFormData, setCreateFormData] = useState({
    patient_name: '',
    patient_id: '',
    blood_type: '',
    units_needed: 1,
    urgency_level: 'normal',
    medical_condition: '',
    contact_details: '',
    location: '',
    preferred_hospitals: []
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'low', label: 'Low Priority' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High Priority' },
    { value: 'critical', label: 'Critical' }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'partially_fulfilled', label: 'Partially Fulfilled' },
    { value: 'fulfilled', label: 'Fulfilled' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'expired', label: 'Expired' }
  ];

  // Fetch available requests from other hospitals
  const fetchAvailableRequests = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page: page.toString(),
        limit: '10',
        ...(bloodTypeFilter !== 'all' && { blood_type: bloodTypeFilter }),
        ...(urgencyFilter !== 'all' && { urgency_level: urgencyFilter })
      };

      const data = await hospitalAPI.getAvailableRequests(params);
      
      if (data) {
        setAvailableRequests(data.requests || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      } else {
        setAvailableRequests([]);
      }
    } catch (err) {
      console.error('Error fetching available requests:', err);
      setAvailableRequests([]);
    } finally {
      setLoading(false);
    }
  }, [bloodTypeFilter, urgencyFilter]);

  // Fetch my hospital's requests
  const fetchMyRequests = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page: page.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter })
      };

      const data = await hospitalAPI.getMyRequests(params);
      
      if (data) {
        setMyRequests(data.requests || []);
        setMyTotalPages(data.totalPages || 1);
        setMyTotal(data.total || 0);
      } else {
        setMyRequests([]);
      }
    } catch (err) {
      console.error('Error fetching my requests:', err);
      setMyRequests([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // Create new hospital blood request
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const data = await hospitalAPI.createRequest(createFormData);
      
      if (data) {
        // Reset form and switch to my requests tab
        setCreateFormData({
          patient_name: '',
          patient_id: '',
          blood_type: '',
          units_needed: 1,
          urgency_level: 'normal',
          medical_condition: '',
          contact_details: '',
          location: '',
          preferred_hospitals: []
        });
        
        setActiveTab('myRequests');
        fetchMyRequests();
        
        alert('Blood request created successfully!');
      } else {
        alert('Failed to create blood request. Please try again.');
      }
    } catch (err) {
      console.error('Error creating request:', err);
      alert('Failed to create blood request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Respond to a request
  const handleRespondToRequest = async (requestId, responseData) => {
    setActionLoading(true);

    try {
      const data = await hospitalAPI.respondToRequest(requestId, 'respond', responseData);
      
      if (data) {
        setShowResponseModal(false);
        setSelectedRequest(null);
        fetchAvailableRequests(currentPage);
        
        alert('Response submitted successfully!');
      } else {
        alert('Failed to submit response. Please try again.');
      }
    } catch (err) {
      console.error('Error responding to request:', err);
      alert('Failed to submit response. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'available') {
      fetchAvailableRequests(currentPage);
    } else if (activeTab === 'myRequests') {
      fetchMyRequests(myCurrentPage);
    }
  }, [activeTab, currentPage, myCurrentPage, fetchAvailableRequests, fetchMyRequests]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      'low': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'normal': 'bg-green-500/20 text-green-300 border-green-500/30',
      'high': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'critical': 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[urgency] || colors.normal;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'partially_fulfilled': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'fulfilled': 'bg-green-500/20 text-green-300 border-green-500/30',
      'cancelled': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      'expired': 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[status] || colors.pending;
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
    <div className="min-h-screen bg-gray-900 flex">
      <HospitalSidebar />
      
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Hospital Support Network
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
              <FaHospital className="text-red-500" />
              Collaborate with other hospitals to support patients in need
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'available'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <FaHandHoldingHeart className="inline mr-2" />
              Available Requests ({total})
            </button>
            <button
              onClick={() => setActiveTab('myRequests')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'myRequests'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <FaBuilding className="inline mr-2" />
              My Requests ({myTotal})
            </button>
            <button
              onClick={() => setActiveTab('createRequest')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'createRequest'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <FaPlus className="inline mr-2" />
              Create Request
            </button>
          </div>

          {/* Available Requests Tab */}
          {activeTab === 'available' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  Requests from Other Hospitals
                </h2>
                
                {/* Filters */}
                <div className="flex gap-4">
                  <select
                    value={bloodTypeFilter}
                    onChange={(e) => setBloodTypeFilter(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                  >
                    <option value="all">All Blood Types</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  
                  <select
                    value={urgencyFilter}
                    onChange={(e) => setUrgencyFilter(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                  >
                    <option value="all">All Urgency Levels</option>
                    {urgencyLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-400 mt-4">Loading requests...</p>
                </div>
              ) : (
                <>
                  {availableRequests.length > 0 ? (
                    <div className="space-y-4">
                      {availableRequests.map((request) => (
                        <div key={request.id} className="bg-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <FaUser className="text-gray-400" />
                                <span className="font-medium text-white">{request.patient_name}</span>
                                <span className={`px-2 py-1 rounded text-xs border ${getBloodTypeColor(request.blood_type)}`}>
                                  {request.blood_type}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs border ${getUrgencyColor(request.urgency_level)}`}>
                                  {request.urgency_level.toUpperCase()}
                                </span>
                                <span className="text-gray-400 text-sm">
                                  {request.units_needed} unit{request.units_needed > 1 ? 's' : ''} needed
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                                <span className="flex items-center gap-1">
                                  <FaHospital />
                                  {request.requesting_hospital_name || request.requesting_hospital}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FaCalendarAlt />
                                  {formatDate(request.created_at)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FaClock />
                                  Expires: {formatDate(request.expires_at)}
                                </span>
                              </div>
                              
                              {request.medical_condition && (
                                <p className="text-gray-300 text-sm">
                                  <FaHeartbeat className="inline mr-2" />
                                  {request.medical_condition}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowDetails(true);
                                }}
                                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                              >
                                <FaEye className="mr-1" />
                                Details
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowResponseModal(true);
                                }}
                                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                              >
                                <FaHandHoldingHeart className="mr-1" />
                                Respond
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Pagination for Available Requests */}
                      {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                          <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                          >
                            Previous
                          </button>
                          
                          {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            const page = i + Math.max(1, currentPage - 2);
                            if (page > totalPages) return null;
                            
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 rounded ${
                                  currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                          
                          <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaInfoCircle className="text-4xl text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No blood requests available at this time.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* My Requests Tab */}
          {activeTab === 'myRequests' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  My Hospital's Requests
                </h2>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-400 mt-4">Loading your requests...</p>
                </div>
              ) : (
                <>
                  {myRequests.length > 0 ? (
                    <div className="space-y-4">
                      {myRequests.map((request) => (
                        <div key={request.id} className="bg-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <FaUser className="text-gray-400" />
                                <span className="font-medium text-white">{request.patient_name}</span>
                                <span className={`px-2 py-1 rounded text-xs border ${getBloodTypeColor(request.blood_type)}`}>
                                  {request.blood_type}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(request.status)}`}>
                                  {request.status.replace('_', ' ').toUpperCase()}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs border ${getUrgencyColor(request.urgency_level)}`}>
                                  {request.urgency_level.toUpperCase()}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                                <span>{request.units_needed} unit{request.units_needed > 1 ? 's' : ''} needed</span>
                                <span className="flex items-center gap-1">
                                  <FaCalendarAlt />
                                  {formatDate(request.created_at)}
                                </span>
                                {request.responding_hospital && (
                                  <span className="flex items-center gap-1">
                                    <FaHospital />
                                    Response from: {request.responding_hospital_name || request.responding_hospital}
                                  </span>
                                )}
                              </div>
                              
                              {request.response_notes && (
                                <p className="text-green-300 text-sm bg-green-900/20 p-2 rounded">
                                  Response: {request.response_notes}
                                </p>
                              )}
                            </div>
                            
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowDetails(true);
                              }}
                              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                            >
                              <FaEye className="mr-1" />
                              Details
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Pagination for My Requests */}
                      {myTotalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                          <button
                            onClick={() => setMyCurrentPage(myCurrentPage - 1)}
                            disabled={myCurrentPage === 1}
                            className="px-3 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                          >
                            Previous
                          </button>
                          
                          {[...Array(Math.min(5, myTotalPages))].map((_, i) => {
                            const page = i + Math.max(1, myCurrentPage - 2);
                            if (page > myTotalPages) return null;
                            
                            return (
                              <button
                                key={page}
                                onClick={() => setMyCurrentPage(page)}
                                className={`px-3 py-2 rounded ${
                                  myCurrentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                          
                          <button
                            onClick={() => setMyCurrentPage(myCurrentPage + 1)}
                            disabled={myCurrentPage === myTotalPages}
                            className="px-3 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaInfoCircle className="text-4xl text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">You haven't created any blood requests yet.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Create Request Tab */}
          {activeTab === 'createRequest' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                Create Blood Request
              </h2>
              
              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={createFormData.patient_name}
                      onChange={(e) => setCreateFormData({...createFormData, patient_name: e.target.value})}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Patient ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={createFormData.patient_id}
                      onChange={(e) => setCreateFormData({...createFormData, patient_id: e.target.value})}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Blood Type *
                    </label>
                    <select
                      required
                      value={createFormData.blood_type}
                      onChange={(e) => setCreateFormData({...createFormData, blood_type: e.target.value})}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500"
                    >
                      <option value="">Select Blood Type</option>
                      {bloodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Units Needed *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={createFormData.units_needed}
                      onChange={(e) => setCreateFormData({...createFormData, units_needed: parseInt(e.target.value)})}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Urgency Level
                    </label>
                    <select
                      value={createFormData.urgency_level}
                      onChange={(e) => setCreateFormData({...createFormData, urgency_level: e.target.value})}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500"
                    >
                      {urgencyLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contact Details
                    </label>
                    <input
                      type="text"
                      value={createFormData.contact_details}
                      onChange={(e) => setCreateFormData({...createFormData, contact_details: e.target.value})}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500"
                      placeholder="Phone number, email, etc."
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Medical Condition / Notes
                  </label>
                  <textarea
                    rows="3"
                    value={createFormData.medical_condition}
                    onChange={(e) => setCreateFormData({...createFormData, medical_condition: e.target.value})}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500"
                    placeholder="Brief description of patient condition or urgency details..."
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Creating...' : 'Create Request'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white">Request Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimesCircle size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Patient Name</label>
                    <p className="text-white font-medium">{selectedRequest.patient_name}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Patient ID</label>
                    <p className="text-white">{selectedRequest.patient_id || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Blood Type</label>
                    <p className="text-white font-medium">{selectedRequest.blood_type}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Units Needed</label>
                    <p className="text-white">{selectedRequest.units_needed}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Urgency</label>
                    <p className="text-white">{selectedRequest.urgency_level.toUpperCase()}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Status</label>
                    <p className="text-white">{selectedRequest.status?.replace('_', ' ').toUpperCase()}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm">Requesting Hospital</label>
                  <p className="text-white">{selectedRequest.requesting_hospital_name || selectedRequest.requesting_hospital}</p>
                </div>
                
                {selectedRequest.medical_condition && (
                  <div>
                    <label className="text-gray-400 text-sm">Medical Condition</label>
                    <p className="text-white">{selectedRequest.medical_condition}</p>
                  </div>
                )}
                
                {selectedRequest.contact_details && (
                  <div>
                    <label className="text-gray-400 text-sm">Contact Details</label>
                    <p className="text-white">{selectedRequest.contact_details}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Created</label>
                    <p className="text-white">{formatDate(selectedRequest.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Expires</label>
                    <p className="text-white">{formatDate(selectedRequest.expires_at)}</p>
                  </div>
                </div>
                
                {selectedRequest.response_notes && (
                  <div>
                    <label className="text-gray-400 text-sm">Response Notes</label>
                    <p className="text-green-300 bg-green-900/20 p-3 rounded">
                      {selectedRequest.response_notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedRequest && (
        <ResponseModal
          request={selectedRequest}
          onClose={() => setShowResponseModal(false)}
          onSubmit={handleRespondToRequest}
          loading={actionLoading}
        />
      )}
    </div>
  );
}

// Response Modal Component
function ResponseModal({ request, onClose, onSubmit, loading }) {
  const [responseData, setResponseData] = useState({
    response_status: 'offered',
    units_offered: 1,
    response_notes: '',
    estimated_delivery_time: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(request.id, responseData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-white">
              Respond to Blood Request
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <FaTimesCircle size={20} />
            </button>
          </div>
          
          <div className="mb-4 p-3 bg-gray-700 rounded">
            <p className="text-sm text-gray-300">
              <strong>{request.patient_name}</strong> needs <strong>{request.units_needed}</strong> unit(s) of <strong>{request.blood_type}</strong>
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Response Type
              </label>
              <select
                value={responseData.response_status}
                onChange={(e) => setResponseData({...responseData, response_status: e.target.value})}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              >
                <option value="offered">Offer Blood Units</option>
                <option value="declined">Cannot Fulfill</option>
              </select>
            </div>
            
            {responseData.response_status === 'offered' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Units Available
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={request.units_needed}
                    value={responseData.units_offered}
                    onChange={(e) => setResponseData({...responseData, units_offered: parseInt(e.target.value)})}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estimated Delivery Time
                  </label>
                  <input
                    type="datetime-local"
                    value={responseData.estimated_delivery_time}
                    onChange={(e) => setResponseData({...responseData, estimated_delivery_time: e.target.value})}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                rows="3"
                value={responseData.response_notes}
                onChange={(e) => setResponseData({...responseData, response_notes: e.target.value})}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                placeholder="Additional notes or instructions..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
