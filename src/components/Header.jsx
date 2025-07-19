import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import manIcon from '../assets/man.png';

export default function Header() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    if (name || email) {
      setUser({ name, email });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setDropdownOpen(false);
    navigate('/login');
  };

  const goToDashboard = () => {
    setDropdownOpen(false);
    navigate('/userdashboard');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <div onClick={() => navigate('/')} className="flex items-center space-x-2 text-red-600 font-extrabold text-2xl tracking-tight cursor-pointer">
          <img src="/favicon.png" alt="logo" className="w-7 h-7" />
          <span>Life Stream</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6 text-gray-700 text-sm font-semibold">
          <div onClick={() => navigate('/')} className="cursor-pointer hover:text-red-600 hover:underline underline-offset-4 transition duration-200">Home</div>
          <div onClick={() => navigate('/donate')} className="cursor-pointer hover:text-red-600 hover:underline underline-offset-4 transition duration-200">Donate</div>
          <div onClick={() => navigate('/find')} className="cursor-pointer hover:text-red-600 hover:underline underline-offset-4 transition duration-200">Find Blood</div>
          <div onClick={() => navigate('/about')} className="cursor-pointer hover:text-red-600 hover:underline underline-offset-4 transition duration-200">About</div>
          <div onClick={() => navigate('/contact')} className="cursor-pointer hover:text-red-600 hover:underline underline-offset-4 transition duration-200">Contact</div>
        </nav>

        {/* Profile & Dropdown */}
        <div className="flex items-center gap-4 relative">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600 focus:outline-none"
              >
                <img src={manIcon} alt="User" className="w-7 h-7 rounded-full border-2 border-red-100" />
                {user.name || user.email?.split('@')[0]}
                <FaChevronDown
                  className={`w-3 h-3 transform transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2 w-44 bg-red-600 border border-red-500 rounded-lg shadow-xl z-50 transition-all duration-200 ease-in-out transform ${
                  dropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                }`}
              >
                <button
                  onClick={goToDashboard}
                  className="block w-full text-center px-4 py-2 text-sm text-white hover:text-red-300 transition"
                >
                  Dashboard
                </button>

                <div className="h-[4px]" /> {/* Smaller gap */}

                <button
                  onClick={handleLogout}
                  className="block w-full text-center px-4 py-2 text-sm text-white hover:text-red-300 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <span className="hidden md:inline text-sm text-gray-500 font-medium">
                Welcome to <span className="text-red-600 font-semibold">Life Stream</span>
              </span>
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-md text-sm font-semibold shadow hover:from-red-600 hover:to-red-700 transition duration-300"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
