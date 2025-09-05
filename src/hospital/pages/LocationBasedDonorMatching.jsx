import { useEffect, useState, useCallback } from 'react';
import HospitalSidebar from '../components/HospitalSidebar';
import { 
  FaUser, 
  FaEnvelope, 
  FaTint, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaInfoCircle,
  FaChartBar
} from 'react-icons/fa';
import hospitalAPI from '../../config/hospitalAPI.js';

export default function LocationBasedDonorMatching() {
  const [loading, setLoading] = useState(true);
  const [hospitalLocation, setHospitalLocation] = useState('');
  const [locationStats, setLocationStats] = useState(null);
  const [selectedBloodType, setSelectedBloodType] = useState('O+');
  const [compatibleDonors, setCompatibleDonors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Fetch compatible donors for selected blood type
  const fetchCompatibleDonors = useCallback(async (bloodType, page = 1) => {
    setLoading(true);
    try {
      const params = {
        bloodType,
        page: page.toString(),
        limit: '15'
      };

      const data = await hospitalAPI.getLocationCompatibleDonors(params);

      if (data) {
        setCompatibleDonors(data.donors || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
        setHospitalLocation(data.hospitalLocation || '');
      }
    } catch (err) {
      console.error('Error fetching compatible donors:', err);
      setCompatibleDonors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch location statistics
  const fetchLocationStats = useCallback(async () => {
    try {
      const data = await hospitalAPI.getLocationStats();

      if (data) {
        setLocationStats(data);
        setHospitalLocation(data.hospitalLocation || '');
      }
    } catch (err) {
      console.error('Error fetching location stats:', err);
    }
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchCompatibleDonors(selectedBloodType, page);
  };

  // Handle blood type selection
  const handleBloodTypeSelect = (bloodType) => {
    setSelectedBloodType(bloodType);
    setCurrentPage(1);
    fetchCompatibleDonors(bloodType, 1);
  };

  useEffect(() => {
    fetchLocationStats();
    fetchCompatibleDonors(selectedBloodType);
  }, [fetchCompatibleDonors, fetchLocationStats, selectedBloodType]);

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
    <div className="min-h-screen bg-gray-900 flex">
      <HospitalSidebar />
      
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Location-Based Compatible Donors
            </h1>
            <p className="text-gray-400 flex items-center gap-2 mb-4">
              <FaMapMarkerAlt className="text-red-500" />
              Find compatible donors in your hospital location: <span className="text-white font-medium">{hospitalLocation}</span>
            </p>
            
            {/* How it works info */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
                <FaInfoCircle />
                How Location-Based Compatible Matching Works
              </h3>
              <p className="text-sm text-gray-300">
                Select a blood type to see donors in your location who can donate to that blood type. 
                The system shows medically compatible donors who chose "{hospitalLocation}" related hospitals as their preferred blood bank.
              </p>
            </div>
          </div>

          {/* Location Statistics */}
          {locationStats && (
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaChartBar className="text-blue-500" />
                Location Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">
                    {locationStats.totalLocalDonors}
                  </div>
                  <div className="text-gray-300">Total Local Donors</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">
                    {locationStats.totalCompatibleDonors}
                  </div>
                  <div className="text-gray-300">Compatible Donors</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-400">
                    {locationStats.stats?.length || 0}
                  </div>
                  <div className="text-gray-300">Blood Types Covered</div>
                </div>
              </div>

              {/* Blood Type Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                {locationStats.stats?.map((stat) => (
                  <div key={stat.bloodType} className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className={`text-sm font-bold px-2 py-1 rounded border ${getBloodTypeColor(stat.bloodType)} mb-2`}>
                      {stat.bloodType}
                    </div>
                    <div className="text-xs text-gray-300">
                      Local: {stat.localDonors}
                    </div>
                    <div className="text-xs text-gray-400">
                      Compatible: {stat.compatibleDonors}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blood Type Selection & Results */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Blood Type to Find Compatible Donors:
              </label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {bloodTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => handleBloodTypeSelect(type)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      selectedBloodType === type
                        ? 'bg-blue-600 text-white border-blue-500'
                        : `${getBloodTypeColor(type)} hover:bg-opacity-30`
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Info */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-gray-400">
                Showing {compatibleDonors.length} of {total} compatible donors for {selectedBloodType} in {hospitalLocation}
              </div>
              <div className="text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading compatible donors...</p>
              </div>
            ) : (
              <>
                {/* Donors List */}
                {compatibleDonors.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {compatibleDonors.map((donor) => (
                      <div key={donor.id} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <FaUser className="text-gray-400" />
                              <span className="font-medium text-white">{donor.name}</span>
                              <span className={`px-2 py-1 rounded text-xs border ${getBloodTypeColor(donor.blood_type)}`}>
                                {donor.blood_type}
                              </span>
                              {donor.compatibility_type && (
                                <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                  {donor.compatibility_type}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <FaEnvelope />
                                {donor.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaCalendarAlt />
                                Registered: {formatDate(donor.created_at)}
                              </span>
                              {donor.donor_location && (
                                <span className="flex items-center gap-1">
                                  <FaMapMarkerAlt />
                                  Location: {donor.donor_location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaInfoCircle className="text-4xl text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">
                      No compatible donors found for {selectedBloodType} in your location.
                    </p>
                    <div className="text-sm text-gray-500 bg-gray-800 rounded-lg p-4 mt-4">
                      <p className="mb-2">To see compatible donors for {selectedBloodType}, users need to:</p>
                      <ul className="text-left list-disc list-inside space-y-1">
                        <li>Have blood types that are compatible with {selectedBloodType}</li>
                        <li>Submit a donation request through the "Donate Blood" page</li>
                        <li>Select your hospital ("{hospitalLocation}") as their preferred blood bank</li>
                        <li>Their donation request will then appear in your compatible donors list</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
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
                          onClick={() => handlePageChange(page)}
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
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}