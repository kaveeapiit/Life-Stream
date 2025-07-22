import HospitalSidebar from '../components/HospitalSidebar';
import { useEffect, useState } from 'react';

export default function HospitalDashboard() {
  // Example: fetch stats later
  const [stats, setStats] = useState({
    pendingDonors: 12,
    pendingRecipients: 5,
    approvedToday: 9,
    declinedToday: 2,
  });

  // optional fade-in mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <HospitalSidebar />

      <main className={`flex-1 ml-0 md:ml-64 p-8 md:p-12 space-y-10 overflow-x-hidden transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        {/* Hero */}
        <section className="space-y-2 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Welcome to the <span className="text-red-400">Hospital Dashboard</span> 🏥
          </h1>
          <p className="text-gray-300 max-w-2xl">
            Manage donor & recipient approvals, track requests, and keep things moving smoothly.
          </p>
        </section>

        {/* Quick Stats */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Pending Donors" value={stats.pendingDonors} accent="from-red-500 to-red-700" />
          <StatCard label="Pending Recipients" value={stats.pendingRecipients} accent="from-amber-500 to-amber-700" />
          <StatCard label="Approved Today" value={stats.approvedToday} accent="from-green-500 to-green-700" />
          <StatCard label="Declined Today" value={stats.declinedToday} accent="from-gray-500 to-gray-700" />
        </section>

        {/* Actions */}
        <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-2xl p-8 animate-fadeIn" style={{ animationDelay: '120ms' }}>
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <DashButton to="/hospital/donor-approval" label="Review Donors" emoji="🩸" />
            <DashButton to="/hospital/recipient-approval" label="Review Recipients" emoji="🧪" />
            <DashButton to="/hospital/reports" label="View Reports" emoji="📊" />
            <DashButton to="/hospital/settings" label="Settings" emoji="⚙️" />
          </div>
        </section>
      </main>

      {/* tiny anim */}
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

/* ---------- Small components ---------- */
function StatCard({ label, value, accent }) {
  return (
    <div className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${accent} animate-fadeIn`}>
      <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
      <p className="text-sm uppercase tracking-wider text-white/80">{label}</p>
      <h3 className="text-4xl font-bold mt-2">{value}</h3>
    </div>
  );
}

function DashButton({ to, label, emoji }) {
  return (
    <a
      href={to}
      className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-800/60 border border-gray-700 text-sm font-medium 
                 hover:bg-gray-700 hover:border-gray-600 transition animate-fadeIn"
    >
      <span className="text-lg">{emoji}</span> {label}
    </a>
  );
}
