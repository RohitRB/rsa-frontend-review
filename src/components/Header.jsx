import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const isAdminPage = location.pathname.startsWith('/admin');

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-blue-600 text-white py-4 px-4 md:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
          <span>Kalyan Enterprises</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button onClick={toggleMenu} className="md:hidden text-white">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {isAdminPage ? (
              <>
                <li><Link to="/admin/dashboard" className="hover:text-blue-200">Dashboard</Link></li>
                <li><Link to="/admin/policies" className="hover:text-blue-200">Policies</Link></li>
                <li><Link to="/admin/customers" className="hover:text-blue-200">Customers</Link></li>
                <li><Link to="/admin/help" className="hover:text-blue-200">Help</Link></li>
                {isAuthenticated && (
                  <li><button onClick={logout} className="hover:text-blue-200">Logout</button></li>
                )}
              </>
            ) : (
              <>
                <li><Link to="https://kalyanworkshop.in/" className="hover:text-blue-200">Home</Link></li>
                <li><Link to="https://kalyanworkshop.in/our-services/" className="hover:text-blue-200">Services</Link></li>
                <li><Link to="https://kalyanworkshop.in/contact-us/" className="hover:text-blue-200">Contact Us</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 px-4">
          <ul className="space-y-4">
            {isAdminPage ? (
              <>
                <li><Link to="/admin/dashboard" onClick={toggleMenu} className="block hover:text-blue-200">Dashboard</Link></li>
                <li><Link to="/admin/policies" onClick={toggleMenu} className="block hover:text-blue-200">Policies</Link></li>
                <li><Link to="/admin/customers" onClick={toggleMenu} className="block hover:text-blue-200">Customers</Link></li>
                <li><Link to="/admin/help" onClick={toggleMenu} className="block hover:text-blue-200">Help</Link></li>
                {isAuthenticated && (
                  <li><button onClick={() => { logout(); toggleMenu(); }} className="hover:text-blue-200">Logout</button></li>
                )}
              </>
            ) : (
              <>
                <li><a href="https://kalyanworkshop.in/" className="block hover:text-blue-200">Home</a></li>
                <li><a href="https://kalyanworkshop.in/our-services/" className="block hover:text-blue-200">Services</a></li>
                <li><a href="https://kalyanworkshop.in/contact-us/" className="block hover:text-blue-200">Contact Us</a></li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
