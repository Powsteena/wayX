import React, { useState, useEffect } from 'react';
import '../Styles.css';
import ManageDrivers from './ManageDrivers';
import ManageRides from './ManageRides';
import ManageUsers from './ManageUsers';
import ManageContacts from './ManageContacts';
import {
  LayoutDashboard,
  Users,
  Car,
  MapPin,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
} from 'lucide-react';

const AdminDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalRides, setTotalRides] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeContent, setActiveContent] = useState('Dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch('http://localhost:5000/api/user/count');
        const driversResponse = await fetch('http://localhost:5000/api/driver/count');
        const ridesResponse = await fetch('http://localhost:5000/api/rides/count');

        if (!usersResponse.ok || !driversResponse.ok || !ridesResponse.ok) {
          throw new Error('Failed to fetch one or more resources');
        }

        const usersData = await usersResponse.json();
        const driversData = await driversResponse.json();
        const ridesData = await ridesResponse.json();

        setTotalUsers(usersData.count);
        setTotalDrivers(driversData.count);
        setTotalRides(ridesData.count);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data. Please try again later.');
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-400 bg-red-900 bg-opacity-20 rounded-lg">
        {error}
      </div>
    );
  }

  const stats = [
    { title: 'Total Users', value: totalUsers, icon: Users },
    { title: 'Total Drivers', value: totalDrivers, icon: Car },
    { title: 'Total Rides', value: totalRides, icon: MapPin },
  ];

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard },
    { title: 'Users', icon: Users },
    { title: 'Drivers', icon: Car },
    { title: 'Rides', icon: MapPin },
    { title: 'Contacts', icon: Mail },
  ];

  const renderContent = () => {
    switch (activeContent) {
      case 'Dashboard':
        return (
          <div>
            <div className="welcome-card bg-gradient-to-r from-black via-black/50 to-black p-6 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-yellow-600">
                Welcome, Admin!
              </h2>
              <p className="text-gray-400">Here's an overview of platform activity.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-t-4 border-yellow-600"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium mb-1 text-gray-400">{stat.title}</p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {stat.value.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 rounded-full bg-gray-700">
                      <stat.icon className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-500 text-sm">Overview</p>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: `${(stat.value / 1000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Users':
        return <ManageUsers />;
      case 'Drivers':
        return <ManageDrivers />;
      case 'Rides':
        return <ManageRides />;
      case 'Contacts':
        return <ManageContacts />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard flex bg-gradient-to-br from-black via-gray-900 to-gray-800 min-h-screen text-white">
      <div
        className={`relative border-r border-gray-700 bg-black transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-yellow-600 text-black rounded-full p-1.5 shadow-md hover:bg-yellow-600 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <div className="p-6">
          <h2 className={`text-xl font-bold transition-all ${isCollapsed ? 'hidden' : 'block'}`}>
            Admin Panel
          </h2>
        </div>
        <nav className="px-3 space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveContent(item.title)}
              className="flex items-center gap-5 p-3 rounded-lg hover:bg-gray-700 transition"
            >
              <item.icon size={24} className="text-yellow-600" />
              <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{item.title}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-8 w-full px-4">
          <button className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 transition">
            <LogOut size={24} className="text-yellow-600" />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Logout</span>
          </button>
        </div>
      </div>
      <div className="flex-grow p-8">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
