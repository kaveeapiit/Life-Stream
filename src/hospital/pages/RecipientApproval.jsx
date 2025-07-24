import { useEffect, useState } from 'react';
import HospitalSidebar from '../components/HospitalSidebar';

export default function RecipientApproval() {
  const [recipients, setRecipients] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/recipient/pending', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRecipients(data);
        else setRecipients([]);
      })
      .catch(err => console.error('Failed to fetch recipients', err))
      .finally(() => setLoading(false));
  }, []);

  const handleApproval = async (id, approve) => {
    try {
      const res = await fetch(`http://localhost:5000/api/recipient/approve/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: approve }),
        credentials: 'include'
      });
      const updated = await res.json();
      setRecipients(prev => prev.filter(r => r.id !== updated.id));
    } catch (e) {
      alert('Failed to update');
    }
  };

  const filtered = recipients.filter(r =>
    [r.name, r.email, r.blood_type, r.location]
      .join(' ')
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <HospitalSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-8 md:p-12 space-y-10 overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Recipient Approval
          </h1>

          <div className="relative w-full sm:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search recipients…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 transition"
            />
          </div>
        </div>

        {/* Cards container */}
        <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-2xl p-6 md:p-8 min-h-[50vh]">
          {loading && (
            <p className="text-center text-gray-400 py-10">Loading…</p>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-gray-400 py-10">No pending requests.</p>
          )}

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((rec, i) => (
              <div
                key={rec.id}
                className="relative rounded-xl bg-gray-900/60 border border-white/10 p-6 shadow-lg hover:shadow-xl transition-all animate-fadeIn"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Blood tag */}
                <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  {rec.blood_type}
                </span>

                <InfoRow label="Name" value={rec.name} />
                <InfoRow label="Email" value={rec.email} />
                <InfoRow label="Location" value={rec.location} />
                <InfoRow
                  label="Urgent"
                  value={
                    rec.urgency
                      ? <span className="text-green-400 font-semibold">✅ Yes</span>
                      : <span className="text-gray-400">No</span>
                  }
                />
                <InfoRow
                  label="Date"
                  value={rec.date ? new Date(rec.date).toLocaleDateString() : new Date().toLocaleDateString()}
                />
                <InfoRow
                  label="Status"
                  value={<span className="text-yellow-300 font-semibold">⏳ Pending</span>}
                />

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleApproval(rec.id, true)}
                    className="flex-1 px-4 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleApproval(rec.id, false)}
                    className="flex-1 px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition"
                  >
                    ❌ Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* fade-in anim */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn .3s ease forwards; }
      `}</style>
    </div>
  );
}

/* Helper */
function InfoRow({ label, value }) {
  return (
    <p className="mb-2 text-sm">
      <span className="font-semibold text-gray-300">{label}:</span>{' '}
      <span className="text-gray-200">{value}</span>
    </p>
  );
}
