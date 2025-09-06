import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
} from 'lucide-react';
import adminAPI from '../../config/adminAPI.js';

export default function ManageHospitals() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'edit', 'create'
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hospitalName, setHospitalName] = useState('');

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const data = await adminAPI.getHospitals();
        
        if (data) {
          const hospitalList = Array.isArray(data) ? data : (data.rows || data.hospitals || []);
          setHospitals(hospitalList);
        } else {
          setHospitals([]);
        }
      } catch (error) {
        showMessage('error', 'Failed to load hospitals: ' + error.message);
        setHospitals([]);
      } finally {
        setLoading(false);
      }
    };

    if (!adminAPI.isLoggedIn()) {
      navigate('/admin/login');
      return;
    }
    fetchHospitals();
  }, [navigate]);

  const refetchHospitals = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getHospitals();
      
      if (data) {
        const hospitalList = Array.isArray(data) ? data : (data.rows || data.hospitals || []);
        setHospitals(hospitalList);
      } else {
        setHospitals([]);
      }
    } catch (error) {
      showMessage('error', 'Failed to load hospitals: ' + error.message);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleCreate = () => {
    setSelectedHospital(null);
    setHospitalName('');
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (hospital) => {
    setSelectedHospital(hospital);
    setHospitalName(hospital.username || '');
    setModalMode('edit');
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!hospitalName.trim()) {
        showMessage('error', 'Hospital name is required');
        return;
      }

      let result;
      if (modalMode === 'create') {
        result = await adminAPI.createHospital({ 
          username: hospitalName.trim(),
          password: 'default123' // Default password for new hospitals
        });
      } else {
        result = await adminAPI.updateHospital(selectedHospital.id, { 
          username: hospitalName.trim()
        });
      }

      if (result) {
        showMessage('success', `Hospital ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
        setShowModal(false);
        refetchHospitals();
      }
    } catch (error) {
      showMessage('error', 'Failed to save hospital: ' + error.message);
    }
  };

  const handleDelete = async (hospitalId) => {
    if (!window.confirm('Are you sure you want to delete this hospital?')) return;

    try {
      await adminAPI.deleteHospital(hospitalId);
      showMessage('success', 'Hospital deleted successfully');
      refetchHospitals();
    } catch (error) {
      showMessage('error', 'Failed to delete hospital: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <AdminSidebar />
      
      <div className="flex-1 ml-0 md:ml-64 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="w-96 h-96 bg-blue-600/25 blur-3xl rounded-full absolute -top-24 -left-24 animate-pulse" />
          <div className="w-80 h-80 bg-indigo-500/20 blur-3xl rounded-full absolute bottom-0 right-0" />
        </div>

        <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Manage Hospitals
              </h1>
              <p className="text-gray-400 mt-2">Simple hospital account management</p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-white"
            >
              <Plus size={20} />
              Add Hospital
            </button>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 
              'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {message.text}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-4 text-gray-400">Loading hospitals...</span>
            </div>
          )}

          {/* Hospital List */}
          {!loading && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-white/20">
                <h2 className="text-xl font-semibold">Hospital Accounts ({hospitals.length})</h2>
              </div>
              
              {hospitals.length === 0 ? (
                <div className="p-12 text-center">
                  <Building2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No hospitals found</p>
                  <p className="text-gray-500 text-sm">Click "Add Hospital" to create one</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {hospitals.map((hospital) => (
                    <div key={hospital.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-blue-500/20">
                          <Building2 className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{hospital.username}</h3>
                          <p className="text-gray-400 text-sm">ID: {hospital.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(hospital)}
                          className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-colors flex items-center space-x-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(hospital.id)}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">
                    {modalMode === 'create' ? 'Add Hospital' : 'Edit Hospital'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hospital Name
                    </label>
                    <input
                      type="text"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter hospital name"
                      autoFocus
                    />
                  </div>
                  
                  {modalMode === 'create' && (
                    <p className="text-sm text-gray-400">
                      Default password "default123" will be assigned. Hospital can change it later.
                    </p>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  >
                    <Save size={16} />
                    {modalMode === 'create' ? 'Create' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
