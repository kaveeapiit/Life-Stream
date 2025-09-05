// src/admin/pages/Hospitals.jsx
import { useEffect, useState, useCallback } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import {
  fetchHospitals, createHospital, updateHospital, deleteHospital
} from '../api/hospitals';
import {
  Plus, Pencil, Trash2, Search, X, ShieldPlus,
  Loader2, Eye, EyeOff
} from 'lucide-react';

export default function Hospitals() {
  const [list, setList]   = useState([]);
  const [total, setTotal] = useState(0);
  const [q, setQ]         = useState('');
  const [page, setPage]   = useState(1);
  const limit = 10;
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState({ username: '', password: '' });
  const [showPwd, setShowPwd]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchHospitals(q, page, limit);
      setList(data.rows);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [q, page, limit]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditingId(null);

    // 👇 You can test with 'Colombo', but leave it blank in production
    setForm({ username: '', password: '' });

    setShowPwd(false);
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({ username: row.username, password: '' });
    setShowPwd(false);
    setShowModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await updateHospital(editingId, form);
      else           await createHospital(form);
      setShowModal(false);
      load();
    } catch (err) {
      alert(err.message || 'Error');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this hospital user?')) return;
    await deleteHospital(id);
    load();
  };

  const pages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <AdminSidebar />
      
      <div className="flex-1 ml-0 md:ml-64 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="w-96 h-96 bg-red-600/25 blur-3xl rounded-full absolute -top-24 -left-24 animate-pulse" />
          <div className="w-80 h-80 bg-indigo-500/20 blur-3xl rounded-full absolute bottom-0 right-0" />
        </div>

        <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fadeIn">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600/80 shadow-lg">
                <ShieldPlus className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  Hospital <span className="text-red-400">Management</span>
                </h1>
                <p className="text-gray-300 text-sm md:text-base">Manage hospital user accounts and access</p>
              </div>
            </div>
          </header>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-2xl p-6">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setPage(1); }}
                  placeholder="Search username..."
                  className="w-full sm:w-72 pl-9 pr-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition"
                />
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              <Plus size={16} /> Add Hospital
            </button>
          </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/10 uppercase tracking-wider text-gray-300">
              <tr>
                <Th>#</Th>
                <Th>Username</Th>
                <Th>Hospital ID</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading && (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-300">
                    <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && list.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-400">
                    No records found
                  </td>
                </tr>
              )}

              {!loading && list.map((row, i) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <Td>{(page - 1) * limit + i + 1}</Td>
                  <Td className="font-medium">{row.username}</Td>
                  <Td><span className="rounded bg-white/10 px-2 py-1 text-xs">{row.id}</span></Td>
                  <Td className="text-right">
                    <button
                      onClick={() => openEdit(row)}
                      className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-white/10"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(row.id)}
                      className="inline-flex items-center justify-center rounded-lg p-2 text-red-400 hover:bg-white/10 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded-md px-3 py-1 text-sm border transition ${
                p === page
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white/10 text-gray-200 border-white/20 hover:bg-white/20'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white text-black shadow-2xl">
            {/* Accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-red-500 via-pink-500 to-indigo-500" />

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-3 top-3 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-black"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6">
              <h2 className="mb-5 text-xl font-semibold">
                {editingId ? 'Edit Hospital User' : 'Add Hospital User'}
              </h2>

              <form onSubmit={submit} className="space-y-5">
                {/* Username */}
                <div>
                  <label className="mb-1 block text-sm font-medium">Username</label>
                  <input
                    required
                    value={form.username}
                    onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {editingId ? 'New Password (leave blank to keep current)' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                      placeholder={editingId ? '********' : ''}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(s => !s)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-black"
                    >
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    {editingId ? 'Save Changes' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
        
        </main>
        
        <style>{`
          @keyframes fadeIn { from {opacity:0; transform: translateY(8px);} to {opacity:1; transform: translateY(0);} }
          .animate-fadeIn { animation: fadeIn .4s ease forwards; }
        `}</style>
      </div>
    </div>
  );
}

function Th({ children, className = '' }) {
  return <th className={`px-4 py-3 text-xs font-semibold ${className}`}>{children}</th>;
}
function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}
