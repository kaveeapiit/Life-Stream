import { useNavigate } from "react-router-dom";
import { Shield, Users, Droplet, Activity, FileText, Settings, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const quickLinks = [
    { to: "/admin/users", label: "Manage Users", icon: Users },
    { to: "/admin/donations", label: "Donations", icon: Droplet },
    { to: "/admin/requests", label: "Blood Requests", icon: Activity },
    { to: "/admin/reports", label: "Reports", icon: FileText },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white overflow-hidden">
      {/* Blobs */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="w-96 h-96 bg-red-600/25 blur-3xl rounded-full absolute -top-24 -left-24 animate-pulse" />
        <div className="w-80 h-80 bg-indigo-500/20 blur-3xl rounded-full absolute bottom-0 right-0" />
      </div>

      <main className="p-6 md:p-10 max-w-6xl mx-auto space-y-10 animate-fadeIn">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600/80 shadow-lg">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                Welcome, <span className="text-red-400">Admin</span>
              </h1>
              <p className="text-gray-300 text-sm md:text-base">Here’s what’s happening today.</p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/admin/login");
            }}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold border border-white/20 transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </header>

        {/* Stats */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Users" value="1,248" accent="from-red-500 to-red-700" />
          <StatCard label="Donations Today" value="34" accent="from-emerald-500 to-emerald-700" />
          <StatCard label="Open Requests" value="12" accent="from-amber-500 to-amber-700" />
          <StatCard label="Pending Approvals" value="7" accent="from-indigo-500 to-indigo-700" />
        </section>

        {/* Quick Actions */}
        <section className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map(({ to, label, icon: Icon }) => (
              <button
                key={to}
                onClick={() => navigate(to)}
                className="group flex items-center gap-3 px-5 py-4 rounded-xl bg-gray-900/50 border border-gray-700/60 hover:bg-gray-800/70 hover:border-gray-600 transition shadow-lg"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-600/30 text-red-300 group-hover:bg-red-600/40">
                  <Icon size={20} />
                </div>
                <span className="text-sm font-semibold text-gray-200 group-hover:text-white">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* tiny anim */}
      <style>{`
        @keyframes fadeIn { from {opacity:0; transform: translateY(8px);} to {opacity:1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn .4s ease forwards; }
      `}</style>
    </div>
  );
}

/* ---------- Small components ---------- */
function StatCard({ label, value, accent }) {
  return (
    <div className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${accent}`}>
      <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
      <p className="text-xs uppercase tracking-wider text-white/80">{label}</p>
      <h3 className="text-4xl font-bold mt-2">{value}</h3>
    </div>
  );
}
