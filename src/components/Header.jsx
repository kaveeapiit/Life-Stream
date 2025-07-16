import { Link } from 'react-router-dom';

export default function Header() {
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
          <Link to="/" className="hover:text-red-600 hover:underline underline-offset-4 transition duration-200">
            Home
          </Link>
          <Link to="/donate" className="hover:text-red-600 hover:underline underline-offset-4 transition duration-200">
            Donate
          </Link>
          <Link to="/find" className="hover:text-red-600 hover:underline underline-offset-4 transition duration-200">
            Find Blood
          </Link>
          <Link to="/about" className="hover:text-red-600 hover:underline underline-offset-4 transition duration-200">
            About
          </Link>
          <Link to="/contact" className="hover:text-red-600 hover:underline underline-offset-4 transition duration-200">
            Contact
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-sm text-gray-500 font-medium">
            Welcome to <span className="text-red-600 font-semibold">Life Stream</span>
          </span>
          <Link
            to="/login"
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-md text-sm font-semibold shadow hover:from-red-600 hover:to-red-700 transition duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
