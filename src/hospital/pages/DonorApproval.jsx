import { useEffect, useState } from 'react';
import HospitalSidebar from '../components/HospitalSidebar';

export default function DonorApproval() {
  const [donations, setDonations] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/donation/pending')
      .then(res => res.json())
      .then(data => setDonations(data))
      .catch(err => console.error('Failed to fetch pending donations', err))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/donation/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      setDonations(prev => prev.filter(d => d.id !== updated.id));
    } catch (err) {
      alert('Error updating status');
    }
  };

  const filtered = donations.filter(d =>
    [d.name, d.email, d.blood_type, d.location].join(' ').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <HospitalSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-8 md:p-12 overflow-hidden">
        {/* Title + Search */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight">Donor Approvals</h1>

          <div className="relative w-full sm:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search donors…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 transition"
            />
          </div>
        </div>

        {/* Glass container */}
        <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto max-h-[70vh]">
            <table className="w-full text-sm">
              <thead className="bg-white/10 sticky top-0 z-10">
                <tr className="text-left text-gray-200">
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Blood</Th>
                  <Th>Location</Th>
                  <Th className="text-center">Action</Th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="5" className="px-4 py-6 text-center text-gray-400">
                      Loading…
                    </td>
                  </tr>
                )}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-6 text-center text-gray-400">
                      No pending donations.
                    </td>
                  </tr>
                )}

                {filtered.map((d, i) => (
                  <tr
                    key={d.id}
                    className="border-t border-white/5 hover:bg-white/5 transition-all duration-200 animate-fadeIn"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <Td>{d.name}</Td>
                    <Td>{d.email}</Td>
                    <Td>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-red-600/30 text-red-300 text-xs font-semibold">
                        {d.blood_type}
                      </span>
                    </Td>
                    <Td>{d.location}</Td>
                    <Td className="text-center space-x-2">
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-600 hover:bg-green-500 text-white text-xs font-medium transition"
                        onClick={() => updateStatus(d.id, 'Approved')}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition"
                        onClick={() => updateStatus(d.id, 'Declined')}
                      >
                        ❌ Decline
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-white/10 max-h-[70vh] overflow-y-auto">
            {loading && <p className="px-4 py-6 text-center text-gray-400">Loading…</p>}
            {!loading && filtered.length === 0 && (
              <p className="px-4 py-6 text-center text-gray-400">No pending donations.</p>
            )}
            {filtered.map((d, i) => (
              <div
                key={d.id}
                className="p-4 space-y-2 animate-fadeIn"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{d.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-red-600/30 text-red-300 text-xs font-semibold">
                    {d.blood_type}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{d.email}</p>
                <p className="text-gray-400 text-xs">{d.location}</p>

                <div className="pt-2 flex gap-2">
                  <button
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition"
                    onClick={() => updateStatus(d.id, 'Approved')}
                  >
                    ✅ Approve
                  </button>
                  <button
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition"
                    onClick={() => updateStatus(d.id, 'Declined')}
                  >
                    ❌ Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* row fade-in */}
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

/* --- tiny helpers --- */
function Th({ children, className = '' }) {
  return <th className={`px-4 py-3 font-semibold ${className}`}>{children}</th>;
}
function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
