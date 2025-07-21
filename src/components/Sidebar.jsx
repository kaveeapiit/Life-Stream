import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100); // slight delay for animation
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-red-700 to-red-900 text-white p-6 shadow-lg transform transition-transform duration-500 ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col justify-between z-50`}
    >
      <div>
        <h2 className="text-3xl font-extrabold mb-8 tracking-wide animate-fade-in">Life Stream</h2>
        <ul className="space-y-5 text-lg font-medium">
          <li
            className="cursor-pointer hover:bg-red-800 rounded-md px-3 py-2 transition-all duration-200"
            onClick={() => navigate('/UserDashboard')}
          >
            🏠 Dashboard
          </li>
          <li
            className="cursor-pointer hover:bg-red-800 rounded-md px-3 py-2 transition-all duration-200"
            onClick={() => navigate('/profile')}
          >
            👤 My Profile
          </li>
        </ul>
      </div>

      <button
        onClick={logout}
        className="mt-6 bg-white text-red-800 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100 transition-all duration-200"
      >
        🔒 Logout
      </button>
    </div>
  );
}
