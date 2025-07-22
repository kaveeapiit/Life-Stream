import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import manIcon from '../assets/man.png';

export default function Header() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    if (name || email) setUser({ name, email });
  }, []);

  // close on outside click
  useEffect(() => {
    const handler = e => {
      if (dropdownOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

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

  const LinkItem = ({ to, children }) => (
    <div
      onClick={() => navigate(to)}
      className="relative cursor-pointer px-1 py-0.5 text-gray-700 hover:text-red-600 transition group"
    >
      {children}
      <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-red-600 transition-all duration-300 group-hover:w-full" />
    </div>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-red-600 font-extrabold text-2xl tracking-tight cursor-pointer"
        >
          <img src="/favicon.png" alt="logo" className="w-7 h-7" />
          <span>Life Stream</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm font-semibold">
          <LinkItem to="/">Home</LinkItem>
          <LinkItem to="/donate">Donate</LinkItem>
          <LinkItem to="/find-blood">Find Blood</LinkItem>
          <LinkItem to="/about">About</LinkItem>
          <LinkItem to="/contact">Contact</LinkItem>
        </nav>

        {/* Profile & Dropdown */}
        <div className="flex items-center gap-4 relative" ref={menuRef}>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="flex items-center gap-2 text-sm font-medium focus:outline-none
                           bg-black/80 text-white px-4 py-2 rounded-2xl border-2 border-white shadow-sm hover:bg-black/90 transition"
              >
                <img src={manIcon} alt="User" className="w-7 h-7 rounded-full border-2 border-red-200" />
                {user.name || user.email?.split('@')[0]}
                <FaChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown */}
              <div
                className={`absolute right-0 mt-3 w-44 z-50 transition-all duration-200 ease-out
                            ${dropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
              >
                <div className="flex flex-col gap-2">
                  <button
                    onClick={goToDashboard}
                    className="w-full rounded-xl bg-[#111827] text-white py-3 text-sm font-semibold shadow-md
                               border-2 border-red-600 hover:bg-[#1f2937] transition"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl bg-[#111827] text-white py-3 text-sm font-semibold shadow-md
                               border-2 border-red-600 hover:bg-[#1f2937] transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <span className="hidden md:inline text-sm text-gray-500 font-medium">
                Welcome to <span className="text-red-600 font-semibold">Life Stream</span>
              </span>
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-md text-sm font-semibold shadow
                           hover:from-red-600 hover:to-red-700 transition duration-300"
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
