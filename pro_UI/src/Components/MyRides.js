import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, MapPin, Car, User, X } from 'lucide-react';

const CreatedRides = () => {
  const [createdRides, setCreatedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCreatedRides = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/auth/my-rides', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCreatedRides(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch rides');
        setLoading(false);
      }
    };

    fetchCreatedRides();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-4">
        <h2 className="text-2xl font-bold text-gray-800">My Future Rides</h2>
      </div>

      {createdRides.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No rides scheduled yet.
        </div>
      ) : (
        <div className="relative">
          <div className="overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex space-x-4 px-4">
              {createdRides.map((ride) => (
                <div 
                  key={ride._id} 
                  className="flex-shrink-0 w-[300px] bg-white rounded-lg shadow-sm border border-gray-100 relative hover:shadow-md transition-all duration-200"
                >
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>

                  <div className="p-4 space-y-3">
                    {/* Date and Time */}
                    <div className="flex space-x-4 text-sm">
                      <div className="flex items-center text-black space-x-1">
                        <Calendar size={14} className="text-yellow-600" />
                        <span>{new Date(ride.scheduledDateTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-black space-x-1">
                        <Clock size={14} className="text-yellow-600" />
                        <span>{new Date(ride.scheduledDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    {/* Locations */}
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <MapPin size={14} className="text-green-500 mt-1 flex-shrink-0" />
                        <div className="text-sm">
                          <div className="text-xs text-black">Pickup</div>
                          <div className="text-black truncate max-w-[230px]">{ride.pickup.address || 'Not provided'}</div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <MapPin size={14} className="text-red-500 mt-1 flex-shrink-0" />
                        <div className="text-sm">
                          <div className="text-xs text-black">Dropoff</div>
                          <div className="text-black truncate max-w-[230px]">{ride.dropoff.address || 'Not provided'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Info Footer */}
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Car size={14} />
                        <span className="capitalize">{ride.vehicleType}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <User size={14} />
                        <span>{ride.numPassengers || 2}</span>
                      </div>
                    </div>

                    {ride.driverId && (
                      <div className="flex items-center space-x-1 text-sm text-black pt-2 border-t border-gray-100">
                        <User size={14} className="text-yellow-600" />
                        <span className="truncate">Driver: {ride.driverId.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CreatedRides;