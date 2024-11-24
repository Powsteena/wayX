import React, { useState } from 'react';
import { User, LogOut, X, Star, Car, Activity } from 'lucide-react';

const DriverProfile = ({ driverData, onLogout }) => {
  const [showDetails, setShowDetails] = useState(false);

  const stats = [
    { label: 'Rating', value: driverData.rating, icon: Star, color: 'text-yellow-600' },
    { label: 'Total Rides', value: driverData.totalRides, icon: Activity, color: 'text-blue-500' },
    { label: 'Vehicle', value: driverData.vehicleType, icon: Car, color: 'text-green-500' },
  ];

  return (
    <div className="relative">
      {/* Profile Trigger Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowDetails(true)}
          className="flex items-center gap-3 bg-white hover:bg-gray-50 px-4 py-2 rounded-full shadow-md border border-gray-200 transition-all duration-200 group"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-800 leading-tight">{driverData.name}</h3>
            <p className="text-sm text-gray-500">{driverData.vehicleType}</p>
          </div>
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Profile Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-sm m-4 overflow-hidden">
            {/* Modal Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Driver Profile</h2>
              <button 
                onClick={() => setShowDetails(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Driver Info */}
            <div className="flex items-center gap-4 p-4 bg-white">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{driverData.name}</h3>
                <p className="text-gray-600">Professional Driver</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-y-4 p-4 bg-gray-50">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className={`flex items-center gap-2 ${stat.color}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color} bg-opacity-10 p-2 rounded-lg`} />
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer with Logout Button */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverProfile;