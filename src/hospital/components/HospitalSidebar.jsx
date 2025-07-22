import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Droplet, FlaskConical, LogOut } from 'lucide-react';

export default function HospitalSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const Item = ({ to, icon: Icon, label }) => {
    const active = pathname.startsWith(to);
    return (
      <li
        onClick={() => navigate(to)}
        className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg transition
        ${active ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-gray-200'}`}
      >
        <Icon size={18} /> {label}
      </li>
    );
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-red-800/90 to-red-900/90 backdrop-blur-md text-white p-6 shadow-2xl flex flex-col justify-between z-50">
      <div>
        <h2 className="text-2xl font-extrabold mb-10 tracking-wide">Hospital Panel</h2>
        <ul className="space-y-2 text-sm font-medium">
          <Item to="/hospital/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <Item to="/hospital/donor-approval" icon={Droplet} label="Donor Approval" />
          <Item to="/hospital/recipient-approval" icon={FlaskConical} label="Recipient Approval" />
        </ul>
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          navigate('/hospital/login');
        }}
        className="flex items-center justify-center gap-2 bg-white text-red-800 font-semibold px-4 py-2 rounded-md shadow hover:bg-gray-100 transition"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
