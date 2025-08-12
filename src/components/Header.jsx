import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { 
  FaChevronDown, 
  FaHome, 
  FaTint, 
  FaSearch, 
  FaInfoCircle, 
  FaPhone,
  FaUser,
  FaLock
} from 'react-icons/fa';
import manIcon from '../assets/man.png';
import bloodLogo from '../assets/bloodlogo.png';


export default function Header() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    if (name || email) setUser({ name, email });
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    const handler = e => {
      if (dropdownOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  // close mobile menu on outside click
  useEffect(() => {
    const handler = e => {
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const goToDashboard = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/userdashboard');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const LinkItem = ({ to, children, className = "" }) => (
    <div
      onClick={() => handleNavigation(to)}
      className={`relative cursor-pointer px-1 py-0.5 text-gray-700 hover:text-red-600 transition group ${className}`}
    >
      {children}
      <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-red-600 transition-all duration-300 group-hover:w-full" />
    </div>
  );

  const MobileLinkItem = ({ to, children, icon }) => (
    <div
      onClick={() => handleNavigation(to)}
      className="flex items-center space-x-3 px-6 py-4 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer border-b border-gray-100 last:border-b-0"
    >
      {icon && <span className="text-xl text-red-500">{icon}</span>}
      <span className="font-medium text-lg">{children}</span>
    </div>
  );

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

          {/* Logo */}
          <div
            onClick={() => handleNavigation('/')}
            className="flex items-center space-x-2 text-red-600 font-extrabold text-2xl tracking-tight cursor-pointer"
          >
            <img src={bloodLogo} alt="logo" className="w-7 h-7" />
            <span>Life Stream</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 text-sm font-semibold">
            <LinkItem to="/">Home</LinkItem>
            <LinkItem to="/donate">Donate</LinkItem>
            <LinkItem to="/find-blood">Find Blood</LinkItem>
            <LinkItem to="/about">About</LinkItem>
            <LinkItem to="/contact">Contact</LinkItem>
          </nav>

          {/* Desktop Profile & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <span 
                className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span 
                className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span 
                className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </button>

            {/* Desktop Profile & Dropdown */}
            <div className="hidden md:flex items-center gap-4 relative" ref={menuRef}>
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
                  <span className="hidden lg:inline text-sm text-gray-500 font-medium">
                    Welcome to <span className="text-red-600 font-semibold">Life Stream</span>
                  </span>
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-md text-sm font-semibold shadow
                               hover:from-red-600 hover:to-red-700 transition duration-300"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div 
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-red-50">
          <div className="flex items-center space-x-2 text-red-600 font-bold text-xl">
            <img src="/favicon.png" alt="logo" className="w-6 h-6" />
            <span>Life Stream</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-red-100 rounded-full transition-colors duration-200"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <nav className="py-4">
          <MobileLinkItem to="/" icon={<FaHome />}>Home</MobileLinkItem>
          <MobileLinkItem to="/donate" icon={<FaTint />}>Donate</MobileLinkItem>
          <MobileLinkItem to="/find-blood" icon={<FaSearch />}>Find Blood</MobileLinkItem>
          <MobileLinkItem to="/about" icon={<FaInfoCircle />}>About</MobileLinkItem>
          <MobileLinkItem to="/contact" icon={<FaPhone />}>Contact</MobileLinkItem>
        </nav>

        {/* Mobile User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <img src={manIcon} alt="User" className="w-10 h-10 rounded-full border-2 border-red-200" />
                <div>
                  <div className="font-semibold text-gray-800">{user.name || 'User'}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={goToDashboard}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full border-2 border-red-600 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center text-gray-600 mb-4">
                Welcome to <span className="text-red-600 font-semibold">Life Stream</span>
              </div>
              <button
                onClick={() => handleNavigation('/login')}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition duration-300"
              >
                Login
              </button>
              <button
                onClick={() => handleNavigation('/register')}
                className="w-full border-2 border-red-600 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors duration-200"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
