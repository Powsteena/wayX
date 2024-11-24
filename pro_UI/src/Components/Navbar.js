import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../Images/log.png';


const InnerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('driverId');
    navigate('/');
  };

  return (
    <nav className="bg-white backdrop-blur-sm fixed w-full shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo - matches your landing page navbar styling */}
          <a href="/" className="flex items-center">
            <img 
              src={logo} 
              alt="Logo" 
              className="h-12"
            />
          </a>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-yellow-600 text-white px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default InnerNavbar;