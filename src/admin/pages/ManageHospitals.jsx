import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import {
  Building2,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  MapPin,
  Phone,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle,
  Mail,
  Globe,
} from 'lucide-react';
import adminAPI from '../../config/adminAPI.js';

export default function ManageHospitals() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'create'
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    // Check if admin is logged in
    if (!adminAPI.isLoggedIn()) {
      console.log('Admin not logged in, redirecting to login...');
      navigate('/admin/login');
      return;
    }
    console.log('Admin is logged in, fetching hospitals...');
    fetchHospitals();
  }, [navigate]); // fetchHospitals is stable, doesn't need to be in dependencies

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      console.log('Fetching hospitals...');
      console.log('Admin token exists:', !!adminAPI.token);
      const data = await adminAPI.getHospitals();
      console.log('API response:', data);
      if (data) {
        // Handle API response format: {rows: [...], total: number}
        const hospitals = Array.isArray(data) ? data : data.rows || data.hospitals || [];
        console.log('Setting hospitals:', hospitals);
        setHospitals(hospitals);
      } else {
        console.log('No data received from API');
        throw new Error('Failed to fetch hospitals');
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      showMessage('error', 'Failed to load hospitals');
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleView = (hospital) => {
    setSelectedHospital(hospital);
    setFormData({
      name: hospital.name || '',
      address: hospital.address || '',
      phone: hospital.phone || '',
      email: hospital.email || '',
      website: hospital.website || '',
      emergency_contact: hospital.emergency_contact || '',
      operating_hours: hospital.operating_hours || '',
      capacity: hospital.capacity || '',
      specialties: hospital.specialties || '',
      blood_bank_capacity: hospital.blood_bank_capacity || '',
      status: hospital.status || 'active',
    });
    setModalMode('view');
    setShowModal(true);
  };

  const handleEdit = (hospital) => {
    setSelectedHospital(hospital);
    setFormData({
      name: hospital.name || '',
      address: hospital.address || '',
      phone: hospital.phone || '',
      email: hospital.email || '',
      website: hospital.website || '',
      emergency_contact: hospital.emergency_contact || '',
      operating_hours: hospital.operating_hours || '',
      capacity: hospital.capacity || '',
      specialties: hospital.specialties || '',
      blood_bank_capacity: hospital.blood_bank_capacity || '',
      status: hospital.status || 'active',
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedHospital(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      emergency_contact: '',
      operating_hours: '',
      capacity: '',
      specialties: '',
      blood_bank_capacity: '',
      status: 'active',
    });
    setModalMode('create');
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      let result;
      
      if (modalMode === 'create') {
        result = await adminAPI.createHospital(formData);
      } else {
        result = await adminAPI.updateHospital(selectedHospital.id, formData);
      }

      if (result) {
        showMessage('success', `Hospital ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
        setShowModal(false);
        fetchHospitals();
      } else {
        throw new Error('Operation failed');
      }
    } catch (error) {
      console.error('Error saving hospital:', error);
      showMessage('error', error.message || 'Failed to save hospital');
    }
  };

  const handleDelete = async (hospitalId) => {
    if (!window.confirm('Are you sure you want to delete this hospital?')) return;

    try {
      const result = await adminAPI.deleteHospital(hospitalId);
      if (result) {
        showMessage('success', 'Hospital deleted successfully');
        fetchHospitals();
      } else {
        throw new Error('Failed to delete hospital');
      }
    } catch (error) {
      console.error('Error deleting hospital:', error);
      showMessage('error', 'Failed to delete hospital');
    }
  };

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.specialties?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500/20 text-green-300';
      case 'inactive':
        return 'bg-red-500/20 text-red-300';
      case 'maintenance':
        return 'bg-yellow-500/20 text-yellow-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <AdminSidebar />
      
      <div className="flex-1 ml-0 md:ml-64 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="w-96 h-96 bg-red-600/25 blur-3xl rounded-full absolute -top-24 -left-24 animate-pulse" />
          <div className="w-80 h-80 bg-indigo-500/20 blur-3xl rounded-full absolute bottom-0 right-0" />
        </div>

        <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fadeIn">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-600/80 shadow-lg">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold">Manage Hospitals</h1>
                <p className="text-gray-300">View, edit, and manage hospital information</p>
              </div>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <Plus size={18} />
              Add Hospital
            </button>
          </header>

          {/* Message */}
          {message.text && (
            <div className={`p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-500/20 border-green-500/30 text-green-200' 
                : 'bg-red-500/20 border-red-500/30 text-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {message.text}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search hospitals by name, location, or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Hospitals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-3 text-gray-400">Loading hospitals...</p>
              </div>
            ) : filteredHospitals.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400">
                <Building2 size={48} className="mx-auto mb-4 opacity-50" />
                <p>No hospitals found</p>
              </div>
            ) : (
              filteredHospitals.map((hospital) => (
                <div key={hospital.id} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {hospital.name ? hospital.name.charAt(0).toUpperCase() : 'H'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{hospital.name}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(hospital.status)}`}>
                          {hospital.status || 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <MapPin size={14} />
                      <span className="truncate">{hospital.address || 'No address provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Phone size={14} />
                      <span>{hospital.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Clock size={14} />
                      <span>{hospital.operating_hours || 'N/A'}</span>
                    </div>
                  </div>

                  {hospital.specialties && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-400 mb-1">Specialties:</p>
                      <p className="text-sm text-gray-300 line-clamp-2">{hospital.specialties}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <div className="text-xs text-gray-400">
                      ID: {hospital.id}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleView(hospital)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleEdit(hospital)}
                        className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 rounded-lg transition-colors"
                        title="Edit Hospital"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(hospital.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete Hospital"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">
                    {modalMode === 'view' ? 'Hospital Details' : modalMode === 'edit' ? 'Edit Hospital' : 'Create Hospital'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Building2 size={16} className="inline mr-2" />
                      Hospital Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Phone size={16} className="inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Mail size={16} className="inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Globe size={16} className="inline mr-2" />
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Clock size={16} className="inline mr-2" />
                      Operating Hours
                    </label>
                    <input
                      type="text"
                      value={formData.operating_hours}
                      onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })}
                      disabled={modalMode === 'view'}
                      placeholder="e.g., 24/7 or 8:00 AM - 6:00 PM"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Shield size={16} className="inline mr-2" />
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bed Capacity</label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Blood Bank Capacity</label>
                    <input
                      type="number"
                      value={formData.blood_bank_capacity}
                      onChange={(e) => setFormData({ ...formData, blood_bank_capacity: e.target.value })}
                      disabled={modalMode === 'view'}
                      placeholder="Blood units capacity"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={modalMode === 'view'}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Specialties</label>
                  <textarea
                    value={formData.specialties}
                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                    disabled={modalMode === 'view'}
                    rows={3}
                    placeholder="e.g., Cardiology, Emergency Medicine, Blood Bank Services"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Emergency Contact</label>
                  <input
                    type="text"
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              
              {modalMode !== 'view' && (
                <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                  >
                    <Save size={16} />
                    {modalMode === 'create' ? 'Create' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <style>{`
          @keyframes fadeIn { from {opacity:0; transform: translateY(8px);} to {opacity:1; transform: translateY(0);} }
          .animate-fadeIn { animation: fadeIn .4s ease forwards; }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </div>
  );
}
