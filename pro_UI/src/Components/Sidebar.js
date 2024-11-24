
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  MapPin, 
  Settings, 
  LogOut, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import '../Styles.css'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { title: 'Users', icon: <Users size={20} />, path: '/admin-users' },
    { title: 'Drivers', icon: <Car size={20} />, path: '/admin-drivers' },
    { title: 'Rides', icon: <MapPin size={20} />, path: '/admin-rides' },
    { title: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <div 
      className={`relative min-h-screen border-r border-gray-200 bg-black/70 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border border-gray-200 text-gray-600 
          rounded-full p-1.5 shadow-sm hover:bg-gray-50 transition-colors duration-200"
      >
        {isCollapsed ? 
          <ChevronRight size={16} /> : 
          <ChevronLeft size={16} />
        }
      </button>

      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className={`text-xl font-bold text-black/90 overflow-hidden whitespace-nowrap
          transition-all duration-300 ${isCollapsed ? 'scale-0' : 'scale-100'}`}>
          Admin Panel
        </h2>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link 
                to={item.path}
                className="flex items-center gap-4 p-3 rounded-lg text-black/90
                  hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-200 
                  group relative overflow-hidden"
              >
                <span className="transition-transform duration-200 group-hover:scale-110 relative z-10">
                  {item.icon}
                </span>
                <span className={`whitespace-nowrap transition-all duration-300 font-medium relative z-10
                  ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                  {item.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-8 w-full px-4">
        <button 
          className="flex items-center gap-4 w-full p-3 rounded-lg 
            text-black/90 hover:text-yellow-600 hover:bg-yellow-50
            transition-all duration-200 group"
        >
          <span className="transition-transform duration-200 group-hover:scale-110">
            <LogOut size={20} />
          </span>
          <span className={`whitespace-nowrap transition-all duration-300 font-medium
            ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            Logout
          </span>
        </button>
      </div>

      {/* Subtle Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
    </div>
  );
};

export default Sidebar;

