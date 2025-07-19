import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login first");
      navigate('/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-2">Welcome to Life Stream</h1>
      <p className="mb-6">You are now logged in to your user dashboard.</p>

      {/* <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
      >
        Logout
      </button> */}
    </div>
  );
}
