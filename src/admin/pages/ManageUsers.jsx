import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Droplet,
  Calendar,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import adminAPI from '../../config/adminAPI.js';

export default function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'create'
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    blood_type: '',
    date_of_birth: '',
    gender: '',
    emergency_contact: '',
  });

  useEffect(() => {
    // Check if admin is logged in
    if (!adminAPI.isLoggedIn()) {
      console.log('Admin not logged in, redirecting to login...');
      navigate('/admin/login');
      return;
    }
    console.log('Admin is logged in, fetching users...');
    fetchUsers();
  }, [navigate]); // fetchUsers is stable, doesn't need to be in dependencies

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users...');
      console.log('Admin token exists:', !!adminAPI.token);
      const data = await adminAPI.getUsers();
      console.log('API response:', data);
      if (data) {
        // Handle API response format: {rows: [...], total: number}
        const users = Array.isArray(data) ? data : data.rows || data.users || [];
        console.log('Setting users:', users);
        setUsers(users);
      } else {
        console.log('No data received from API');
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showMessage('error', 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      blood_type: user.blood_type || '',
      date_of_birth: user.date_of_birth ? user.date_of_birth.split('T')[0] : '',
      gender: user.gender || '',
      emergency_contact: user.emergency_contact || '',
    });
    setModalMode('view');
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      blood_type: user.blood_type || '',
      date_of_birth: user.date_of_birth ? user.date_of_birth.split('T')[0] : '',
      gender: user.gender || '',
      emergency_contact: user.emergency_contact || '',
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      blood_type: '',
      date_of_birth: '',
      gender: '',
      emergency_contact: '',
    });
    setModalMode('create');
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      let result;
      
      if (modalMode === 'create') {
        result = await adminAPI.createUser(formData);
      } else {
        result = await adminAPI.updateUser(selectedUser.id, formData);
      }

      if (result) {
        showMessage('success', `User ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
        setShowModal(false);
        fetchUsers();
      } else {
        throw new Error('Operation failed');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      showMessage('error', error.message || 'Failed to save user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const result = await adminAPI.deleteUser(userId);
      if (result) {
        showMessage('success', 'User deleted successfully');
        fetchUsers();
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showMessage('error', 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.blood_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

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
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600/80 shadow-lg">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold">Manage Users</h1>
                <p className="text-gray-300">View, edit, and manage user accounts</p>
              </div>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <Plus size={18} />
              Add User
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

          {/* Search and Filters */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search users by name, email, or blood type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold">Users ({filteredUsers.length})</h2>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-gray-400">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Blood Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Registration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="font-medium">{user.name || 'N/A'}</p>
                              <p className="text-sm text-gray-400">ID: {user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm">{user.email || 'N/A'}</p>
                            <p className="text-sm text-gray-400">{user.phone || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.blood_type ? 'bg-red-500/20 text-red-300' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {user.blood_type || 'Not Set'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleView(user)}
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 rounded-lg transition-colors"
                              title="Edit User"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">
                    {modalMode === 'view' ? 'User Details' : modalMode === 'edit' ? 'Edit User' : 'Create User'}
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
                      <User size={16} className="inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Phone size={16} className="inline mr-2" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Droplet size={16} className="inline mr-2" />
                      Blood Type
                    </label>
                    <select
                      value={formData.blood_type}
                      onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Blood Type</option>
                      {bloodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Calendar size={16} className="inline mr-2" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
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
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Emergency Contact</label>
                  <input
                    type="text"
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
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
        `}</style>
      </div>
    </div>
  );
}
