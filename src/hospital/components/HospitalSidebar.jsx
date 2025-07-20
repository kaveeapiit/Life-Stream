import { useNavigate } from 'react-router-dom';

export default function HospitalSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens/session here if needed
    navigate('/hospital/login');
  };

  return (
    <aside className="w-64 bg-red-700 text-white flex flex-col py-6 px-4 min-h-screen">
      <h2 className="text-2xl font-bold mb-8">Hospital Panel</h2>
      <nav className="space-y-4">
        <button className="w-full text-left hover:bg-red-600 px-3 py-2 rounded">Donor Approval</button>
        <button className="w-full text-left hover:bg-red-600 px-3 py-2 rounded">Recipient Approval</button>
        <button
          onClick={handleLogout}
          className="w-full text-left mt-8 bg-red-500 hover:bg-red-400 px-3 py-2 rounded"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
