import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-red-600 font-extrabold text-2xl tracking-tight">
          <img src="/favicon.png" alt="logo" className="w-7 h-7" />
          <span>Life Stream</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6 text-gray-700 text-sm font-semibold">
          <Link to="/" className="hover:text-red-600 hover:underline underline-offset-4 transition duration-200">Home</Link>
          <Link to="/donate" className="hover:text-red-600 hover:underline underline-offset-4 transition duration-200">Donate</Link>
          <Link to="/find" className="hover:text-red-600 hover:underline underline-offset-4 transition duration-200">Find Blood</Link>
          <Link to="/about" className="hover:text-red-600 hover:underline underline-offset-4 transition duration-200">About</Link>
          <Link to="/contact" className="hover:text-red-600 hover:underline underline-offset-4 transition duration-200">Contact</Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 relative">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600"
              >
                <img src={manIcon} alt="User" className="w-6 h-6 rounded-full" />
                {user.name || user.email?.split('@')[0]}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <span className="hidden md:inline text-sm text-gray-500 font-medium">
                Welcome to <span className="text-red-600 font-semibold">Life Stream</span>
              </span>
              <Link
                to="/login"
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-md text-sm font-semibold shadow hover:from-red-600 hover:to-red-700 transition duration-300"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
