import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function PendingRequests() {
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState('pending');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5050/api/blood/pending').then(r => r.json()),
      fetch('http://localhost:5050/api/blood/history').then(r => r.json())
    ])
      .then(([p, h]) => {
        setPending(p);
        setHistory(h);
      })
      .catch(err => console.error('Error:', err))
      .finally(() => setLoading(false));
  }, []);

  const list = tab === 'pending' ? pending : history;
  const filtered = list.filter(r =>
    [r.name, r.email, r.blood_type, r.location, r.status]
      .join(' ')
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 sm:p-6 lg:p-8 xl:p-12 overflow-x-hidden">
        {/* Header */}
        <div className="mb-8 sm:mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Blood Requests
          </h1>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search requests…"
              className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-lg bg-gray-800/60 border border-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 transition touch-manipulation"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 sm:mb-8 flex gap-2 sm:gap-3 overflow-x-auto">
          <TabButton active={tab === 'pending'} onClick={() => setTab('pending')}>
            <span className="hidden sm:inline">⏳ Pending ({pending.length})</span>
            <span className="sm:hidden">⏳ {pending.length}</span>
          </TabButton>
          <TabButton active={tab === 'history'} onClick={() => setTab('history')}>
            <span className="hidden sm:inline">📜 History ({history.length})</span>
            <span className="sm:hidden">📜 {history.length}</span>
          </TabButton>
        </div>

        {/* Content */}
        <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl min-h-[50vh]">
          {loading ? (
            <SkeletonGrid />
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-12 sm:py-16 text-sm sm:text-base">
              {tab === 'pending' ? 'No pending requests.' : 'No history yet.'}
            </p>
          ) : (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((req, i) => (
                <RequestCard key={req.id || i} req={req} section={tab} delay={i * 40} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform: translateY(6px);} to { opacity:1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn .35s ease forwards; }
      `}</style>
    </div>
  );
}

/* ---------- Components ---------- */

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition
        ${active
          ? 'bg-red-600 text-white shadow'
          : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60'}`}
    >
      {children}
    </button>
  );
}

function RequestCard({ req, section, delay = 0 }) {
  const statusBadge = () => {
    if (section === 'pending') return <Badge color="yellow">⏳ Pending</Badge>;
    if (req.status === 'approved') return <Badge color="green">✅ Approved</Badge>;
    return <Badge color="red">❌ Declined</Badge>;
  };

  return (
    <div
      className={`relative rounded-xl bg-gray-900/60 border border-white/10 p-6 shadow-lg hover:shadow-xl transition-all animate-fadeIn`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* urgency tag */}
      {req.urgency && (
        <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
          URGENT
        </span>
      )}

      <InfoRow label="Name" value={req.name} />
      <InfoRow label="Email" value={req.email} />
      <InfoRow label="Blood" value={req.blood_type} />
      <InfoRow label="Location" value={req.location} />
      <InfoRow label="Date" value={new Date(req.created_at).toLocaleString()} />
      <InfoRow label="Status" value={statusBadge()} />
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <p className="mb-2 text-sm">
      <span className="font-semibold text-gray-300">{label}:</span>{' '}
      <span className="text-gray-200">{value}</span>
    </p>
  );
}

function Badge({ color, children }) {
  const colors = {
    red: 'bg-red-600/30 text-red-300',
    green: 'bg-green-600/30 text-green-300',
    yellow: 'bg-yellow-500/30 text-yellow-200',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl bg-gray-800/40 border border-white/5 p-6 animate-pulse space-y-3">
          <div className="h-4 w-3/4 bg-gray-700/60 rounded" />
          <div className="h-4 w-2/3 bg-gray-700/60 rounded" />
          <div className="h-4 w-1/2 bg-gray-700/60 rounded" />
          <div className="h-4 w-1/3 bg-gray-700/60 rounded" />
          <div className="h-4 w-2/5 bg-gray-700/60 rounded" />
          <div className="h-4 w-1/4 bg-gray-700/60 rounded" />
        </div>
      ))}
    </div>
  );
}
