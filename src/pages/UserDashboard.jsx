import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API_BASE_URL from '../config/api.js';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!token) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    fetch(`${API_BASE_URL}/api/donation/user/${email}`)
      .then(res => res.json())
      .then(setDonations)
      .catch(err => console.error('Donation fetch error:', err))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-8 md:p-12 overflow-x-hidden">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Welcome to <span className="text-red-400">Life Stream</span>
          </h1>
          <p className="text-gray-300 mt-2 text-sm md:text-base">
            You are now logged in to your dashboard.
          </p>
        </header>

        {/* Container */}
        <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-6">Your Donation Submissions</h2>

          {loading ? (
            <SkeletonTable />
          ) : donations.length === 0 ? (
            <p className="text-center text-gray-400 py-16">No donations submitted yet.</p>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/10 sticky top-0 z-10">
                    <tr className="text-left text-gray-200">
                      <Th>Location</Th>
                      <Th>Blood Type</Th>
                      <Th>Date</Th>
                      <Th>Status</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((d, i) => (
                      <tr
                        key={d.id || i}
                        className="border-t border-white/5 hover:bg-white/5 transition animate-fadeIn"
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        <Td>{d.location || '—'}</Td>
                        <Td>{d.blood_type}</Td>
                        <Td>{new Date(d.created_at).toLocaleString()}</Td>
                        <Td>
                          <StatusChip status={d.status} />
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden grid gap-4">
                {donations.map((d, i) => (
                  <div
                    key={d.id || i}
                    className="rounded-xl bg-gray-900/60 border border-white/10 p-5 shadow-lg animate-fadeIn"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <Row label="Location" value={d.location || '—'} />
                    <Row label="Blood Type" value={d.blood_type} />
                    <Row label="Date" value={new Date(d.created_at).toLocaleString()} />
                    <Row label="Status" value={<StatusChip status={d.status} />} />
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      {/* tiny animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn .35s ease forwards; }
      `}</style>
    </div>
  );
}

/* ---- Small components ---- */
function Th({ children }) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3">{children}</td>;
}

function StatusChip({ status }) {
  const map = {
    Pending: 'bg-yellow-500/30 text-yellow-200',
    Approved: 'bg-green-600/30 text-green-300',
    Declined: 'bg-red-600/30 text-red-300',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-500/30 text-gray-200'}`}>
      {status}
    </span>
  );
}

function Row({ label, value }) {
  return (
    <p className="mb-2 text-sm">
      <span className="font-semibold text-gray-300">{label}:</span>{' '}
      <span className="text-gray-200">{value}</span>
    </p>
  );
}

function SkeletonTable() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-800/40 rounded animate-pulse" />
      ))}
    </div>
  );
}
