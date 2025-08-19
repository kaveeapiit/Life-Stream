import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Droplet, FlaskConical, Users, LogOut, Menu, Package, Plus, Heart, MapPin } from 'lucide-react';

export default function HospitalSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);       // mobile drawer
  const [mounted, setMounted] = useState(false); // entry anim
  const ref = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // close on outside click (mobile)
  useEffect(() => {
    const handler = e => {
      if (open && ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const logout = () => {
    localStorage.clear();
    navigate('/hospital/login');
  };

  const Item = ({ to, icon: Icon, label }) => {
    const active = pathname.toLowerCase().startsWith(to.toLowerCase());
    return (
      <li
        onClick={() => { navigate(to); setOpen(false); }}
        className={`cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg transition
        ${active ? 'bg-white/20 text-white' : 'text-gray-200 hover:bg-white/10'}`}
      >
        <Icon size={18} /> {label}
      </li>
    );
  };

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-red-700/80 text-white"
      >
        <Menu size={20} />
      </button>

      {/* Dark overlay (mobile) */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300
        ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Sidebar */}
      <aside
        ref={ref}
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-red-800/90 to-red-900/90
        backdrop-blur-md text-white p-6 shadow-2xl flex flex-col justify-between z-50
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${mounted ? '' : 'opacity-0'}`}
      >
        <div>
          <h2 className="text-2xl font-extrabold mb-10 tracking-wide animate-fadeIn">Hospital Panel</h2>
                  <ul className="space-y-2 text-sm">
          <Item to="/hospital/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <Item to="/hospital/donor-approval" icon={Droplet} label="Donor Approval" />
          <Item to="/hospital/recipient-approval" icon={FlaskConical} label="Recipient Approval" />
          <Item to="/hospital/available-donors" icon={Users} label="Available Donors" />
          <Item to="/hospital/donor-matching" icon={Heart} label="Donor Matching" />
          <Item to="/hospital/location-matching" icon={MapPin} label="Location Matching" />
          <Item to="/hospital/blood-inventory" icon={Package} label="Blood Inventory" />
          <Item to="/hospital/collect-donation" icon={Plus} label="Collect Donation" />
          <Item to="/hospital/blood-requests" icon={Droplet} label="Blood Requests" />
        </ul>
        </div>

        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 bg-white text-red-800 font-semibold px-4 py-2 rounded-md shadow hover:bg-gray-100 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Anim */}
      <style>{`
        @keyframes fadeIn { from {opacity:0; transform: translateY(6px);} to {opacity:1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn .4s ease forwards; }
      `}</style>
    </>
  );
}
