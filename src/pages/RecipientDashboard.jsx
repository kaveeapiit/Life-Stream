import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecipientDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role?.toLowerCase() !== 'recipient') {
      alert("Access denied: Recipient only");
      navigate('/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // ✅ Clear stored session info
    navigate('/login');
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-2">Welcome, Recipient</h1>
      <p className="mb-6">Request blood and track requests here.</p>

      {/* ✅ Logout Button */}
      {/* <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
      >
        Logout
      </button> */}
    </div>
  );
}
