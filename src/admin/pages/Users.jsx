// src/admin/pages/Users.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, createUser, updateUser, deleteUser } from '../api/users';
import {
  Plus, Pencil, Trash2, Search, X, Droplet, Mail, User as UserIcon, KeyRound, ArrowLeft
} from 'lucide-react';

export default function Users() {
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ email: '', password: '', name: '', blood_group: '' });

  // Hard refresh after edit/delete (as you used)
  const refresh = () => window.location.reload();

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers({ q, page, limit });
      setList(data.rows || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [q, page]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ email: '', password: '', name: '', blood_group: '' });
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditingId(u.id);
    setForm({
      email: u.email,
      password: '',
      name: u.name || '',
      blood_group: u.blood_group || ''
    });
    setShowModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (editingId) await updateUser(editingId, form);
    else await createUser(form);
    setShowModal(false);
    refresh();
  };

  const remove = async (id) => {
    if (!confirm('Delete this user?')) return;
    await deleteUser(id);
    refresh();
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white overflow-hidden">
      {/* blobs */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="w-96 h-96 bg-red-600/25 blur-3xl rounded-full absolute -top-24 -left-24 animate-pulse" />
        <div className="w-80 h-80 bg-indigo-500/20 blur-3xl rounded-full absolute bottom-0 right-0" />
      </div>

      <main className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs border border-white/20 transition"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Users <span className="text-red-400">Management</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="w-full sm:w-72 pl-9 pr-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 transition"
                placeholder="Search email or name..."
                value={q}
                onChange={e => { setPage(1); setQ(e.target.value); }}
              />
            </div>

            <button
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow shadow-red-700/30 transition"
              onClick={openCreate}
            >
              <Plus size={16} /> New User
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-hidden rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
          <div className="overflow-x-auto max-h-[65vh]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-white/10 backdrop-blur-md">
                <tr className="text-left text-gray-200">
                  <Th>ID</Th>
                  <Th>Email</Th>
                  <Th>Name</Th>
                  <Th>Blood Group</Th>
                  <Th>Created</Th>
                  <Th className="text-right pr-4">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <Td colSpan={6}>
                        <div className="h-6 bg-gray-700/40 rounded" />
                      </Td>
                    </tr>
                  ))
                )}

                {!loading && list.map((u, i) => (
                  <tr
                    key={u.id}
                    className="border-t border-white/5 hover:bg-white/5 transition-all duration-150"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <Td>{u.id}</Td>
                    <Td className="font-medium text-red-300 flex items-center gap-2">
                      <Mail size={14} className="text-red-400" /> {u.email}
                    </Td>
                    <Td className="flex itemsester gap-2">
                      <UserIcon size={14} className="text-gray-400" /> {u.name || '—'}
                    </Td>
                    <Td>
                      {u.blood_group ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/30 text-red-200 text-xs font-semibold">
                          <Droplet size={12} /> {u.blood_group}
                        </span>
                      ) : '—'}
                    </Td>
                    <Td>{new Date(u.created_at).toLocaleString()}</Td>
                    <Td className="text-right pr-4 space-x-2">
                      <button
                        onClick={() => openEdit(u)}
                        className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => remove(u.id)}
                        className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold transition"
                      >
                        <Trash2 size={14} /> Del
                      </button>
                    </Td>
                  </tr>
                ))}

                {!loading && !list.length && (
                  <tr>
                    <Td colSpan={6} className="py-10 text-center text-gray-400">
                      No results
                    </Td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4 animate-pulse">
              <div className="h-5 bg-gray-700/40 rounded mb-3" />
              <div className="h-5 bg-gray-700/40 rounded mb-2" />
              <div className="h-5 bg-gray-700/40 rounded" />
            </div>
          ))}

          {!loading && list.map(u => (
            <div key={u.id} className="rounded-xl bg-white/5 border border-white/10 p-4 shadow-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-semibold text-red-300 flex items-center gap-2">
                  <Mail size={14} className="text-red-400" /> {u.email}
                </h3>
                <span className="text-xs text-gray-400">{u.id}</span>
              </div>

              <p className="text-sm text-gray-300 flex items-center gap-2 mb-1">
                <UserIcon size={14} className="text-gray-400" /> {u.name || '—'}
              </p>
              <p className="text-sm text-gray-300 flex items-center gap-2 mb-1">
                <Droplet size={14} className="text-red-400" /> {u.blood_group || '—'}
              </p>
              <p className="text-xs text-gray-400 mb-3">
                {new Date(u.created_at).toLocaleString()}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(u)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => remove(u.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold transition"
                >
                  <Trash2 size={14} /> Del
                </button>
              </div>
            </div>
          ))}

          {!loading && !list.length && (
            <p className="text-center text-gray-400 py-10">No results</p>
          )}

          <Pagination page={page} totalPages={totalPages} setPage={setPage} mobile />
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <form onSubmit={save} className="space-y-5">
            <h2 className="text-xl font-semibold">
              {editingId ? 'Edit User' : 'New User'}
            </h2>

            <LabelInput
              icon={<Mail size={16} className="text-red-500" />}
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />

            <LabelInput
              icon={<KeyRound size={16} className="text-red-500" />}
              type="password"
              placeholder={editingId ? 'Password (blank to keep)' : 'Password'}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />

            <LabelInput
              icon={<UserIcon size={16} className="text-red-500" />}
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <LabelInput
              icon={<Droplet size={16} className="text-red-500" />}
              placeholder="Blood Group"
              value={form.blood_group}
              onChange={e => setForm({ ...form, blood_group: e.target.value })}
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700
                           hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white shadow shadow-red-700/30
                           hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm font-semibold"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}

      <style>{`
        @keyframes fadeIn { from {opacity:0; transform: translateY(8px);} to {opacity:1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn .4s ease forwards; }
      `}</style>
    </div>
  );
}

/* ---- Small components ---- */
function Th({ children, className = '' }) {
  return <th className={`px-4 py-3 font-semibold ${className}`}>{children}</th>;
}
function Td({ children, className = '', colSpan }) {
  return <td colSpan={colSpan} className={`px-4 py-3 ${className}`}>{children}</td>;
}

function Pagination({ page, totalPages, setPage, mobile = false }) {
  return (
    <div className={`p-4 flex items-center justify-between text-gray-300 text-xs sm:text-sm ${mobile ? '' : ''}`}>
      <span>Page {page} / {totalPages}</span>
      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-3 py-1 border border-white/20 rounded disabled:opacity-40 hover:bg-white/10 transition"
        >
          Prev
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1 border border-white/20 rounded disabled:opacity-40 hover:bg-white/10 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md mx-4 sm:mx-0 p-6 rounded-2xl bg-white text-gray-900 shadow-xl animate-fadeInUp">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        {children}
      </div>
      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .animate-fadeInUp{animation:fadeInUp .25s ease forwards}
      `}</style>
    </div>
  );
}

function LabelInput({ icon, ...props }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
      <input
        {...props}
        className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-400/40 outline-none transition placeholder-gray-400"
      />
    </div>
  );
}
