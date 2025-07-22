import HospitalSidebar from '../components/HospitalSidebar';

export default function HospitalDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex">
      {/* Sidebar */}
      <HospitalSidebar />

      {/* Main */}
      <main className="flex-1 pl-64 p-8 md:p-12 space-y-10 overflow-x-hidden">
        {/* Hero */}
        <section className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Welcome to the <span className="text-red-400">Hospital Dashboard</span> 🏥
          </h1>
          <p className="text-gray-300 max-w-2xl">
            Manage donor & recipient approvals, track requests, and keep things moving smoothly.
          </p>
        </section>

        {/* Quick Stats */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Pending Donors" value="12" accent="from-red-500 to-red-700" />
          <StatCard label="Pending Recipients" value="5" accent="from-amber-500 to-amber-700" />
          <StatCard label="Approved Today" value="9" accent="from-green-500 to-green-700" />
          <StatCard label="Declined Today" value="2" accent="from-gray-500 to-gray-700" />
        </section>

        {/* Actions */}
        <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-2xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <DashButton to="/hospital/donor-approval" label="Review Donors" emoji="🩸" />
            <DashButton to="/hospital/recipient-approval" label="Review Recipients" emoji="🧪" />
            <DashButton to="/hospital/reports" label="View Reports" emoji="📊" />
            <DashButton to="/hospital/settings" label="Settings" emoji="⚙️" />
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------- Small components ---------- */
function StatCard({ label, value, accent }) {
  return (
    <div className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${accent}`}>
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
                 hover:bg-gray-700 hover:border-gray-600 transition"
    >
      <span className="text-lg">{emoji}</span> {label}
    </a>
  );
}
