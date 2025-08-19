import HospitalSidebar from '../components/HospitalSidebar';
import { useEffect, useState } from 'react';
import { FaHospital, FaTint, FaFlask, FaChartBar, FaCog, FaUsers, FaWarehouse, FaHeartbeat } from 'react-icons/fa';
import API_BASE_URL from '../../config/api.js';

export default function HospitalDashboard() {
  // Example: fetch stats later
  const [stats, setStats] = useState({
    pendingDonors: 12,
    pendingRecipients: 5,
    approvedToday: 9,
    declinedToday: 2,
    totalInventoryUnits: 0,
    expiringUnits: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    fulfilledRequests: 0,
    urgentPending: 0
  });

  // optional fade-in mount
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    
    // Fetch dashboard statistics
    const fetchDashboardStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/hospital/dashboard/stats`, {
          credentials: 'include'
        });
        if (res.ok) {
          const dashboardStats = await res.json();
          setStats(prev => ({
            ...prev,
            ...dashboardStats
          }));
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };
    
    // Fetch inventory summary for dashboard
    const fetchInventorySummary = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/hospital/inventory/summary`, {
          credentials: 'include'
        });
        if (res.ok) {
          const summary = await res.json();
          const totalUnits = summary.reduce((sum, item) => sum + parseInt(item.available_units), 0);
          const expiringUnits = summary.reduce((sum, item) => sum + parseInt(item.expiring_soon || 0), 0);
          
          setStats(prev => ({
            ...prev,
            totalInventoryUnits: totalUnits,
            expiringUnits: expiringUnits
          }));
        }
      } catch (err) {
        console.error('Error fetching inventory summary:', err);
      }
    };

    // Fetch blood request statistics
    const fetchBloodRequestStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/hospital/blood-requests/stats`, {
          credentials: 'include'
        });
        if (res.ok) {
          const requestStats = await res.json();
          setStats(prev => ({
            ...prev,
            pendingRequests: parseInt(requestStats.pending_requests || 0),
            approvedRequests: parseInt(requestStats.approved_requests || 0),
            fulfilledRequests: parseInt(requestStats.fulfilled_requests || 0),
            urgentPending: parseInt(requestStats.urgent_pending || 0)
          }));
        }
      } catch (err) {
        console.error('Error fetching blood request stats:', err);
      }
    };

    fetchDashboardStats();
    fetchInventorySummary();
    fetchBloodRequestStats();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <HospitalSidebar />

      <main className={`flex-1 ml-0 md:ml-64 p-8 md:p-12 space-y-10 overflow-x-hidden transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        {/* Hero */}
        <section className="space-y-2 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Welcome to the <span className="text-red-400">Hospital Dashboard</span> <FaHospital className="inline text-red-400" />
          </h1>
          <p className="text-gray-300 max-w-2xl">
            Manage donor & recipient approvals, track requests, and keep things moving smoothly.
          </p>
        </section>

        {/* Quick Stats */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          <StatCard label="Pending Donors" value={stats.pendingDonors} accent="from-red-500 to-red-700" />
          <StatCard label="Pending Recipients" value={stats.pendingRecipients} accent="from-amber-500 to-amber-700" />
          <StatCard label="Approved Today" value={stats.approvedToday} accent="from-green-500 to-green-700" />
          <StatCard label="Declined Today" value={stats.declinedToday} accent="from-gray-500 to-gray-700" />
          <StatCard label="Blood Units Available" value={stats.totalInventoryUnits} accent="from-blue-500 to-blue-700" />
          <StatCard label="Expiring Soon" value={stats.expiringUnits} accent="from-orange-500 to-orange-700" />
          <StatCard label="Pending Blood Requests" value={stats.pendingRequests} accent="from-purple-500 to-purple-700" />
          <StatCard label="Urgent Requests" value={stats.urgentPending} accent="from-red-600 to-red-800" />
        </section>

        {/* Actions */}
        <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-2xl p-8 animate-fadeIn" style={{ animationDelay: '120ms' }}>
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <DashButton to="/hospital/donor-approval" label="Review Donors" icon={<FaTint />} />
            <DashButton to="/hospital/recipient-approval" label="Review Recipients" icon={<FaFlask />} />
            <DashButton to="/hospital/available-donors" label="Available Donors" icon={<FaUsers />} />
            <DashButton to="/hospital/blood-inventory" label="Blood Inventory" icon={<FaWarehouse />} />
            <DashButton to="/hospital/blood-requests" label="Blood Requests" icon={<FaHeartbeat />} />
            <DashButton to="/hospital/reports" label="View Reports" icon={<FaChartBar />} />
            <DashButton to="/hospital/settings" label="Settings" icon={<FaCog />} />
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

function DashButton({ to, label, icon }) {
  return (
    <a
      href={to}
      className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-800/60 border border-gray-700 text-sm font-medium 
                 hover:bg-gray-700 hover:border-gray-600 transition animate-fadeIn"
    >
      <span className="text-lg text-red-400">{icon}</span> {label}
    </a>
  );
}
