import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Phone, User, Car, MapPin } from 'lucide-react';

const MyAcceptedRides = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAcceptedRides = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication required. Please login.');
                    setLoading(false);
                    return;
                }

                const axiosInstance = axios.create({
                    baseURL: 'http://localhost:5000/api/auth',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const response = await axiosInstance.get('/my-acceptedrides');
                
                if (response.data && Array.isArray(response.data)) {
                    setRides(response.data);
                } else {
                    throw new Error('Invalid data format received');
                }
            } catch (err) {
                console.error('Error details:', err);
                setError(err.response?.status === 404 ? 'No rides found.' : 'Failed to fetch rides');
            } finally {
                setLoading(false);
            }
        };

        fetchAcceptedRides();
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
                <h2 className="text-2xl font-bold text-gray-800">My Accepted Rides</h2>
            </div>

            {rides.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No accepted rides found.
                </div>
            ) : (
                <div className="relative">
                    <div className="overflow-x-auto pb-4 hide-scrollbar">
                        <div className="flex space-x-4 px-4">
                            {rides.map((ride) => (
                                <div 
                                    key={ride._id} 
                                    className="flex-shrink-0 w-[320px] bg-white rounded-lg shadow-sm border border-gray-100 relative hover:shadow-md transition-all duration-200"
                                >
                                    {/* Status Header */}
                                    <div className="bg-black p-3 rounded-t-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-yellow-600">#{ride._id.slice(-6)}</span>
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-600 text-black">
                                                {ride.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        {/* Locations */}
                                        <div className="space-y-2">
                                            <div className="flex items-start space-x-2">
                                                <MapPin size={14} className="text-yellow-600 mt-1 flex-shrink-0" />
                                                <div className="text-sm">
                                                    <div className="text-xs text-gray-500">Pickup</div>
                                                    <div className="text-gray-700 truncate max-w-[250px]">
                                                        {ride.pickup?.address || 'Not provided'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-2">
                                                <MapPin size={14} className="text-yellow-600 mt-1 flex-shrink-0" />
                                                <div className="text-sm">
                                                    <div className="text-xs text-gray-500">Dropoff</div>
                                                    <div className="text-gray-700 truncate max-w-[250px]">
                                                        {ride.dropoff?.address || 'Not provided'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Driver Info */}
                                        <div className="bg-yellow-50 rounded-lg p-3 space-y-2 mt-2">
                                            <div className="flex items-center space-x-2">
                                                <User size={14} className="text-yellow-600" />
                                                <div className="text-sm">
                                                    <div className="text-xs text-gray-500">Driver</div>
                                                    <div className="text-gray-700">{ride.driverId?.username || 'Not assigned'}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Car size={14} className="text-yellow-600" />
                                                <div className="text-sm">
                                                    <div className="text-xs text-gray-500">Vehicle</div>
                                                    <div className="text-gray-700 truncate">
                                                        {ride.driverId?.vehicleType || 'Not provided'} - {ride.driverId?.vehicleNumber || 'No number'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Phone size={14} className="text-yellow-600" />
                                                <div className="text-sm">
                                                    <div className="text-xs text-gray-500">Contact</div>
                                                    <div className="text-gray-700">{ride.driverId?.phoneNumber || 'Not provided'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Scheduled Time */}
                                        <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                                            Scheduled: {new Date(ride.scheduledDateTime).toLocaleString()}
                                        </div>
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

export default MyAcceptedRides;