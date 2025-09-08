import HospitalSidebar from '../components/HospitalSidebar';
import { useEffect, useState } from 'react';
import { FaHospital, FaTint, FaFlask, FaChartBar, FaCog, FaUsers, FaWarehouse, FaHeartbeat, FaHeart } from 'react-icons/fa';
import hospitalAPI from '../../config/hospitalAPI.js';

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
        const dashboardStats = await hospitalAPI.getDashboardStats();
        if (dashboardStats) {
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
        const summary = await hospitalAPI.getInventorySummary();
        if (summary) {
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
        const requestStats = await hospitalAPI.getBloodRequestStats();
        if (requestStats) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <HospitalSidebar />

      <main className={`flex-1 lg:ml-64 p-4 lg:p-8 xl:p-12 space-y-6 lg:space-y-10 overflow-x-hidden transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        {/* Hero */}
        <section className="space-y-2 animate-fadeIn">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
            Welcome to the <span className="text-red-400">Hospital Dashboard</span> <FaHospital className="inline text-red-400" />
          </h1>
          <p className="text-gray-300 max-w-2xl text-sm lg:text-base">
            Manage donor & recipient approvals, track requests, and keep things moving smoothly.
          </p>
        </section>

        {/* Quick Stats */}
        <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
        <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-2xl p-4 lg:p-8 animate-fadeIn" style={{ animationDelay: '120ms' }}>
          <h2 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            <DashButton to="/hospital/donor-approval" label="Review Donors" icon={<FaTint />} />
            <DashButton to="/hospital/recipient-approval" label="Review Recipients" icon={<FaFlask />} />
            <DashButton to="/hospital/available-donors" label="Available Donors" icon={<FaUsers />} />
            <DashButton to="/hospital/donor-matching" label="Donor Matching" icon={<FaHeart />} />
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
    <div className={`relative overflow-hidden rounded-lg lg:rounded-xl p-4 lg:p-6 bg-gradient-to-br ${accent} animate-fadeIn`}>
      <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
      <p className="text-xs lg:text-sm uppercase tracking-wider text-white/80">{label}</p>
      <h3 className="text-2xl lg:text-4xl font-bold mt-1 lg:mt-2">{value}</h3>
    </div>
  );
}

function DashButton({ to, label, icon }) {
  return (
    <a
      href={to}
      className="flex flex-col items-center gap-2 lg:gap-3 px-3 lg:px-5 py-3 lg:py-4 rounded-lg bg-gray-800/60 border border-gray-700 text-xs lg:text-sm font-medium 
                 hover:bg-gray-700 hover:border-gray-600 transition animate-fadeIn text-center"
    >
      <span className="text-lg lg:text-xl text-red-400">{icon}</span> 
      <span className="text-gray-200 leading-tight">{label}</span>
    </a>
  );
}
